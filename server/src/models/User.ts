import { Schema, model } from "mongoose";
import bcrypt from "bcryptjs";

/*
  USUARIO + ARTISTA + CLIENTE + EMPRESA + ENDERECO viram UMA coleção "users".
  Como artista/cliente/empresa eram 1:1 com usuário, no Mongo é melhor
  "embutir" (embed) esses dados dentro do próprio usuário: uma única consulta
  traz tudo e o _id do usuário já é o id do artista/cliente/empresa.
*/

const enderecoSchema = new Schema({
  cep: String,
  logradouro: String,
  numero: String,
  complemento: String,
  bairro: String,
  cidade: String,
  estado: String,
});

const artistaSchema = new Schema(
  {
    nomeArtistico: { type: String, required: true, trim: true },
    biografia: String,
    dataNascimento: Date,
    cidade: String,
    estado: String,
    fotoPerfil: String, // URL da imagem
    categoriaArtistica: String,
    valorHora: Number,
    disponibilidade: {
      type: String,
      enum: ["disponivel", "ocupado", "indisponivel"],
      default: "disponivel",
    },
    // "publicado" por padrão só para facilitar seus testes; depois você pode
    // trocar para "rascunho" e criar uma tela/rota de aprovação.
    statusPerfil: {
      type: String,
      enum: ["rascunho", "publicado", "suspenso"],
      default: "publicado",
    },
  },
  { _id: false } // sub-documento 1:1 não precisa de _id próprio
);

const clienteSchema = new Schema(
  { cpf: String, nomeCompleto: String, dataNascimento: Date, cidade: String, estado: String },
  { _id: false }
);

const empresaSchema = new Schema(
  {
    razaoSocial: String,
    nomeFantasia: String,
    cnpj: String,
    emailContato: String,
    descricao: String,
    site: String,
    cidade: String,
    estado: String,
    logo: String,
  },
  { _id: false }
);

const userSchema = new Schema(
  {
    nome: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    // select:false => a senha NUNCA vem nas consultas, a não ser que você peça (+senha)
    senha: { type: String, required: true, select: false },
    telefone: String,
    tipoUsuario: { type: String, enum: ["artista", "cliente", "empresa", "admin"], required: true },
    status: { type: String, enum: ["ativo", "inativo", "bloqueado"], default: "ativo" },

    artista: artistaSchema,
    cliente: clienteSchema,
    empresa: empresaSchema,
    enderecos: [enderecoSchema], // um usuário pode ter vários endereços
  },
  // timestamps cria as datas automaticamente (data_cadastro = createdAt)
  { timestamps: { createdAt: "dataCadastro", updatedAt: "atualizadoEm" } }
);

// Índices únicos (o "sparse" ignora usuários que não têm CPF/CNPJ)
userSchema.index({ "cliente.cpf": 1 }, { unique: true, sparse: true });
userSchema.index({ "empresa.cnpj": 1 }, { unique: true, sparse: true });
// Acelera a listagem de artistas por categoria/cidade
userSchema.index({ tipoUsuario: 1, "artista.categoriaArtistica": 1, "artista.cidade": 1 });

// Antes de salvar, transforma a senha em hash (nunca guardamos senha pura)
userSchema.pre("save", async function () {
  if (!this.isModified("senha")) return;
  this.senha = await bcrypt.hash(this.senha, 10);
});

export const User = model("User", userSchema);
