# Guia de estudo: o backend do AWAW (Node + Express + MongoDB)

Este guia explica o código da pasta `server/` na ordem em que vale a pena estudar. Cada seção diz **o que o arquivo faz**, **por que foi feito assim** e **o que você pode experimentar**.

---

## 0. Como rodar o projeto completo

```bash
# 1) Front (na raiz do projeto)
npm install
# 2) Back
npm run server:install        # = npm --prefix server install
cp server/.env.example server/.env   # abra e preencha MONGODB_URI e JWT_SECRET

# 3) Em DOIS terminais:
npm run dev        # front  -> http://localhost:5173
npm run server     # back   -> http://localhost:3001
```

O front chama `/api/...`. O Vite (configurado no `vite.config.ts`) repassa essas chamadas para `localhost:3001`. Por isso não há erro de CORS durante o desenvolvimento.

---

## 1. O mapa geral: o caminho de uma requisição

Exemplo: alguém preenche o cadastro de artista e clica em enviar.

```
SingUp.tsx  --fetch POST /api/auth/registrar-->  Vite (proxy)  -->  Express (server.ts)
   -> routes/auth.ts  (valida os dados)
   -> models/User.ts  (regras do banco + hash da senha)
   -> MongoDB         (grava o documento na coleção "users")
   <- JSON { token, usuario }  volta até o front
```

Cada camada tem **uma responsabilidade**:

| Camada | Pasta/arquivo | Responsabilidade |
|---|---|---|
| Entrada | `server.ts` | Liga o Express, conecta o banco, registra as rotas |
| Rotas | `routes/*.ts` | Recebem a requisição, validam, chamam o model, respondem |
| Middleware | `middleware/auth.ts` | Código que roda *antes* da rota (ex.: checar login) |
| Models | `models/*.ts` | Definem a **forma** dos dados e as regras do banco |
| Conexão | `db.ts` | Abre a conexão com o MongoDB |

---

## 2. Conceitos de MongoDB que você precisa ter na cabeça

| Banco relacional (suas tabelas) | MongoDB |
|---|---|
| Banco | Banco (database) |
| Tabela | **Coleção** (collection) |
| Linha | **Documento** (parecido com um objeto JSON) |
| Coluna | Campo |
| PK (`id_usuario`) | `_id` (criado automaticamente, tipo `ObjectId`) |
| FK | Campo `ObjectId` com `ref` (referência) |
| JOIN | `populate()` (no Mongoose) ou **embutir** os dados |

Um documento de usuário artista fica assim no banco:

```json
{
  "_id": "66fb1c...",
  "nome": "Katz",
  "email": "katz@teste.com",
  "senha": "$2a$10$...(hash)...",
  "tipoUsuario": "artista",
  "status": "ativo",
  "artista": {
    "nomeArtistico": "Katz",
    "categoriaArtistica": "Pintura",
    "cidade": "Santos",
    "disponibilidade": "disponivel",
    "statusPerfil": "publicado"
  },
  "enderecos": [],
  "dataCadastro": "2026-10-01T..."
}
```

### A decisão mais importante: **embutir** ou **referenciar**?

- **Embutir** (dentro do mesmo documento): quando os dados são lidos juntos, são 1:1 ou 1:poucos e não crescem sem parar. Exemplos: artista dentro do usuário, trabalhos dentro do portfólio, itens dentro do pedido.
- **Referenciar** (guardar o `_id` do outro documento): quando é N:N, quando o outro documento é usado por muita gente ou quando cresce sem limite. Exemplos: `mensagens` (milhares por conversa), `pedidos` (um usuário tem muitos), `produtos` (de um artista).

Regra prática: *"eu sempre leio isso junto?"* Se sim, embuta. *"Isso cresce sem parar?"* Se sim, coleção própria.

Além disso, o pedido guarda o **nome e preço do produto no momento da compra** (cópia, não só referência). Se o artista mudar o preço depois, o pedido antigo continua certo. Em banco relacional isso também é boa prática.

---

## 3. `server/package.json` e `tsconfig.json`

**Dependências:**

- `express`: o servidor web (define rotas como `GET /api/artistas`).
- `mongoose`: conversa com o MongoDB e define os *schemas* (formato dos dados).
- `bcryptjs`: gera o hash da senha.
- `jsonwebtoken`: cria e confere os tokens de login (JWT).
- `cors`: libera o front a chamar a API.
- `dotenv`: lê o arquivo `.env`.
- `tsx` (dev): roda TypeScript direto, sem compilar. É por isso que o script é `tsx watch src/server.ts` (o `watch` reinicia o servidor quando você salva um arquivo).

`"type": "module"` faz o Node usar `import ... from` (a mesma sintaxe do seu React).

---

## 4. `.env` e `.env.example`

O `.env` guarda **segredos** (senha do banco, chave do JWT) fora do código. O `.env.example` é só um modelo, sem segredos, que vai para o GitHub. O `.env` real **nunca** pode ser enviado ao GitHub (já está no `.gitignore`).

- `MONGODB_URI`: o endereço do banco. Formato Atlas: `mongodb+srv://usuario:senha@cluster.xxx.mongodb.net/awaw?...`. O `/awaw` é o **nome do banco**. Se a senha tiver caracteres especiais (`@`, `#`, `/`), troque por código URL (ex.: `@` vira `%40`).
- `JWT_SECRET`: texto longo e aleatório. Quem souber esse texto consegue forjar logins, então é secreto.

---

## 5. `src/db.ts`: a conexão

```ts
await mongoose.connect(uri);
```

Abre a conexão uma vez. O Mongoose a reaproveita em todas as consultas. `async/await` é usado porque conectar leva tempo e o código espera terminar antes de seguir.

---

## 6. `src/server.ts`: o ponto de entrada

Ponto por ponto:

1. `import "dotenv/config"` **precisa ser o primeiro import**, para o `.env` já estar carregado quando os outros arquivos forem lidos.
2. `app.use(cors(...))`: permite chamadas vindas de `http://localhost:5173`.
3. `app.use(express.json())`: sem isso, `req.body` chega vazio. Ele transforma o JSON recebido em objeto JavaScript.
4. `app.use("/api/auth", authRoutes)`: tudo que começa com `/api/auth` é tratado em `routes/auth.ts`. Dentro de lá, a rota `"/login"` vira `/api/auth/login`.
5. `conectarBanco().then(() => app.listen(...))`: **só sobe o servidor depois de conectar no banco**. Se a conexão falhar, mostra o erro e encerra.

---

## 7. `models/User.ts`: o arquivo mais importante

### 7.1 Schema e Model

- **Schema** = a "planta" do documento (campos, tipos, regras).
- **Model** = ferramenta criada a partir do schema para consultar e gravar (`User.find()`, `User.create()`...).

`model("User", userSchema)` cria o model `User`. O Mongoose coloca o nome no plural e minúsculo para a coleção: `users`.

### 7.2 Regras dentro do schema

```ts
email: { type: String, required: true, unique: true, lowercase: true, trim: true }
```

- `required`: não grava sem esse campo.
- `unique`: cria um **índice único** no banco, então dois usuários não têm o mesmo e-mail.
- `lowercase` e `trim`: normalizam o texto antes de gravar (`" Ana@X.com "` vira `"ana@x.com"`).
- `enum: [...]`: só aceita esses valores (`tipoUsuario`, `status`...).
- `default`: valor usado quando nada é enviado.

### 7.3 `select: false` na senha

Faz a senha **não vir** em nenhuma consulta. Por isso, no login, é preciso pedir explicitamente: `.select("+senha")`. Isso evita vazar o hash por engano numa rota.

### 7.4 Sub-documentos (`artista`, `cliente`, `empresa`)

São schemas menores dentro do `userSchema`. O `{ _id: false }` evita criar um `_id` desnecessário para cada um (só o usuário precisa de `_id`). Como um usuário é **de um tipo só**, os outros dois ficam ausentes naquele documento.

### 7.5 `timestamps`

```ts
{ timestamps: { createdAt: "dataCadastro", updatedAt: "atualizadoEm" } }
```

O Mongoose preenche essas datas sozinho (na criação e em toda alteração). Trocamos os nomes padrão (`createdAt`/`updatedAt`) para combinar com as suas tabelas (`data_cadastro`).

### 7.6 Índices

```ts
userSchema.index({ "cliente.cpf": 1 }, { unique: true, sparse: true });
```

Índice é um "sumário" que deixa a busca rápida. `unique` impede CPF repetido. `sparse` ignora documentos que **não têm** o campo (artistas não têm CPF e, sem o `sparse`, o Mongo trataria "sem CPF" como um valor repetido). O índice de listagem (`tipoUsuario + categoria + cidade`) acelera a busca de artistas.

### 7.7 Hash da senha (`pre("save")`)

```ts
userSchema.pre("save", async function () {
  if (!this.isModified("senha")) return;
  this.senha = await bcrypt.hash(this.senha, 10);
});
```

- É um **hook**: roda automaticamente *antes* de gravar.
- `isModified("senha")`: só refaz o hash se a senha mudou. Sem isso, cada `save()` faria hash de um hash e ninguém conseguiria logar.
- `bcrypt.hash(senha, 10)`: o `10` é o custo (quanto mais alto, mais lento e mais seguro). O hash **não tem volta**: para conferir o login, o bcrypt refaz o cálculo e compara.

> Atenção: esse hook roda em `create()` e `save()`. Se um dia você usar `updateOne` para trocar a senha, ele **não** roda.

---

## 8. `middleware/auth.ts`: login com JWT

**JWT** é um "crachá" assinado. Fluxo:

1. O usuário faz login. O servidor confere a senha e entrega um token.
2. O front guarda o token (aqui, em `localStorage`).
3. Nas rotas protegidas, o front manda `Authorization: Bearer <token>`.
4. O servidor verifica a assinatura com o `JWT_SECRET`. Se for válida, sabe quem é o usuário **sem consultar o banco**.

```ts
jwt.sign({ tipoUsuario }, segredo(), { subject: id, expiresIn: "7d" })
```

- O `subject` é o id do usuário (no token, vira o campo `sub`).
- `expiresIn: "7d"`: o token vale 7 dias.

**`exigirLogin`** é um *middleware*: função `(req, res, next)`. Se o token for válido, ela guarda `{id, tipoUsuario}` em `res.locals.usuario` e chama `next()` (segue para a rota). Se não for, responde `401` e a rota nem executa. Uso:

```ts
router.put("/me", exigirLogin, async (req, res) => { ... })
```

> O token **não é criptografado**, só assinado: qualquer um consegue ler o conteúdo (tente colar um token em jwt.io). Por isso nunca coloque senha ou dados sensíveis dentro dele.

---

## 9. `routes/auth.ts`: cadastro e login

### `POST /registrar`

1. Valida o básico (nome, e-mail, senha de 6+ caracteres).
2. Confere `tipoUsuario` contra a lista `TIPOS_PERMITIDOS`. **`admin` não está nela de propósito**, senão qualquer pessoa se cadastraria como administradora.
3. A função `pegar(origem, campos)` copia **só os campos permitidos**. Sem isso, alguém poderia mandar `{"artista": {"statusPerfil": "suspenso", ...}}` ou qualquer campo extra e gravar o que quisesse (isso se chama *mass assignment*).
4. `User.create(...)` grava (e o hook faz o hash).
5. Erros:
   - `e.code === 11000`: erro de índice único do Mongo (e-mail/CPF/CNPJ repetido), devolvemos `409`.
   - `e.name === "ValidationError"`: algum `required`/`enum` falhou, devolvemos `400`.
   - Qualquer outro: `500`, e o erro real aparece só no terminal do servidor.

### `POST /login`

- Busca o usuário pelo e-mail com `.select("+senha")`.
- `bcrypt.compare(senhaDigitada, hashDoBanco)`.
- A mensagem é a **mesma** para "e-mail não existe" e "senha errada". Assim ninguém descobre quais e-mails estão cadastrados.

### Códigos HTTP usados

`200` ok · `201` criado · `400` dados inválidos · `401` não autenticado · `403` sem permissão · `404` não achado · `409` conflito (duplicado) · `500` erro do servidor.

---

## 10. `routes/artistas.ts`: consultas

### Listagem: `GET /api/artistas`

```ts
User.find(filtro).select("artista").sort(...).skip(...).limit(...).lean()
```

- `find(filtro)`: o filtro é um objeto. A chave `"artista.cidade"` (com ponto) filtra **dentro do sub-documento**.
- `.select("artista")`: devolve só o perfil artístico (nada de e-mail ou telefone).
- `.skip()` e `.limit()`: **paginação**. Página 2 com 12 por página: `skip(12).limit(12)`.
- `.lean()`: devolve objetos JavaScript simples, mais rápidos que documentos Mongoose completos. Use quando só vai ler e mandar como JSON.
- `Promise.all([...])`: roda a busca e a contagem **ao mesmo tempo**.
- Os limites (`Math.min(50, ...)`) impedem alguém de pedir 1 milhão de itens.

### Perfil: `GET /api/artistas/:id`

- `mongoose.isValidObjectId(id)`: se alguém mandar `/api/artistas/abc`, evitamos um erro estranho do Mongo e respondemos `404`.
- Busca o artista, depois os portfólios dele. Filtramos os trabalhos `publicado` em JavaScript.
- É isso que alimentaria a página da Katz com dados reais.

### Edição: `PUT /api/artistas/me`

- Passa por `exigirLogin`, e o id vem do **token**, nunca do corpo da requisição. Assim ninguém edita o perfil de outra pessoa.
- Monta `{ "artista.biografia": "...", ... }` e usa `$set` para alterar **só esses campos**, sem apagar o resto.
- `runValidators: true`: sem isso, o Mongoose **não** valida os `enum` em `findByIdAndUpdate`.

---

## 11. Os outros models (resumo do raciocínio)

| Arquivo | O que observar |
|---|---|
| `Portfolio.ts` | `trabalhos: [trabalhoSchema]` é um **array de sub-documentos**. Cada trabalho ganha seu próprio `_id`. |
| `Produto.ts` | Duas coleções no mesmo arquivo. O campo `categoria` é uma **referência** (`ref`). `dimensoes` agrupa peso/altura/largura/profundidade. |
| `Pedido.ts` | Itens embutidos com cópia de preço. `validate` garante pelo menos 1 item. |
| `Contratacao.ts` | Evento e contrato embutidos (1:1). `numeroContrato` único (sparse). Status com fluxo: solicitada → aceita → em andamento → concluída. |
| `Pagamento.ts` | Hook `pre("validate")` garante **pedido XOR contratação** (um dos dois, nunca ambos nem nenhum). |
| `Avaliacao.ts` | Índice único `{contratacao, avaliador}`: ninguém avalia duas vezes a mesma contratação. `nota` entre 1 e 5. |
| `Conversa.ts` | Dois models. Mensagens ficam separadas (crescem sem limite), com índice `{conversa, dataEnvio}` para listar o histórico em ordem rápido. |
| `Favorito.ts` | Índices únicos **parciais** (`partialFilterExpression`): impedem favoritar o mesmo artista/produto duas vezes, mas sem conflitar quando o outro campo está vazio. |

Esses models já existem, mas **ainda não têm rotas**. Só `users` e `portfolios` são usados pelas rotas atuais.

---

## 12. Referência rápida do Mongoose

```ts
// Criar
await User.create({ ... });

// Buscar
await User.find({ tipoUsuario: "artista" });          // vários
await User.findOne({ email: "a@b.com" });             // um
await User.findById(id);                              // pelo _id
await User.countDocuments({ status: "ativo" });       // contar

// Atualizar
await User.findByIdAndUpdate(id, { $set: { telefone: "1199..." } }, { new: true, runValidators: true });

// Apagar
await User.findByIdAndDelete(id);

// "JOIN": troca o _id pelo documento referenciado
await Produto.find().populate("artista", "artista.nomeArtistico");

// Operadores comuns de filtro
{ valor: { $gte: 100, $lte: 500 } }       // entre 100 e 500
{ categoria: { $in: ["Pintura", "Foto"] } }
{ nome: /ana/i }                          // contém "ana" (sem diferenciar maiúscula)
```

---

## 13. Testando sem o front (curl) e vendo o banco

```bash
# Cadastrar
curl -X POST localhost:3001/api/auth/registrar -H "Content-Type: application/json" \
  -d '{"nome":"Katz","email":"katz@teste.com","senha":"123456","tipoUsuario":"artista","artista":{"nomeArtistico":"Katz","categoriaArtistica":"Pintura","cidade":"Santos"}}'

# Login (copie o "token" da resposta)
curl -X POST localhost:3001/api/auth/login -H "Content-Type: application/json" \
  -d '{"email":"katz@teste.com","senha":"123456"}'

# Rota protegida
curl -X PUT localhost:3001/api/artistas/me -H "Content-Type: application/json" \
  -H "Authorization: Bearer COLE_O_TOKEN_AQUI" \
  -d '{"biografia":"Artista visual de Santos."}'

# Listar
curl "localhost:3001/api/artistas?cidade=Santos"
```

Abra o **MongoDB Compass**, conecte com a mesma `MONGODB_URI` e olhe a coleção `users`: confira o hash da senha e o formato do documento.

---

## 14. Erros comuns

| Sintoma | Causa provável |
|---|---|
| `MONGODB_URI não definido` | Faltou criar o `server/.env` (ou o nome está errado) |
| `MongoServerSelectionError` | Seu IP não está liberado no Atlas (*Network Access*), ou a string de conexão está errada |
| `bad auth` | Usuário/senha do banco errados (ou caractere especial na senha sem codificar) |
| Front mostra "Não foi possível conectar ao servidor" | O `npm run server` não está rodando |
| `E-mail ... já cadastrado` (409) | Você já cadastrou esse e-mail; use outro ou apague o documento no Compass |
| `req.body` vem `undefined` | Faltou `express.json()` ou o cabeçalho `Content-Type: application/json` |

---

## 15. Exercícios para fixar

1. **Fácil:** adicione o campo `instagram` ao sub-documento `artista`, reinicie o servidor, cadastre um artista e confira no Compass.
2. **Fácil:** em `GET /api/artistas`, adicione um filtro `?nome=` usando regex em `artista.nomeArtistico`.
3. **Médio:** crie `routes/portfolios.ts` com `POST /api/portfolios` (protegido, só artista, `artista` = id do token) e adicione a rota no `server.ts`.
4. **Médio:** crie `POST /api/portfolios/:id/trabalhos` usando `$push` para adicionar um trabalho ao array.
5. **Médio:** crie a rota `PUT /api/auth/senha` (protegida) que confere a senha atual e salva a nova. Dica: busque com `.select("+senha")`, altere e use `.save()` para o hook rodar.
6. **Difícil:** crie `POST /api/pedidos`: receba `[{produtoId, quantidade}]`, busque os produtos no banco, **calcule o total no servidor** (nunca confie no preço vindo do front) e grave o pedido com os itens.
7. **Difícil:** na rota de avaliações, calcule a média de notas de um artista com `Avaliacao.aggregate([...])` (`$match` + `$group` com `$avg`).

---

## 16. Para pesquisar depois

Validação com **zod**, **rate limit** no login (`express-rate-limit`), **helmet** (cabeçalhos de segurança), upload de imagens (Cloudinary ou S3, guardando só a URL no banco), refresh token, e deploy (Render/Railway para o back, Vercel/Netlify para o front, Atlas para o banco).
