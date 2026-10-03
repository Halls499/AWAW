import { Router } from "express";
import bcrypt from "bcryptjs";
import { User } from "../models/User";
import { gerarToken } from "../middleware/auth";

const router = Router();

// "admin" NÃO pode ser criado pelo cadastro público
const TIPOS_PERMITIDOS = ["artista", "cliente", "empresa"];

// Copia só os campos permitidos (evita que alguém mande campos que não deveria)
function pegar(origem: any, campos: string[]) {
  const resultado: Record<string, unknown> = {};
  for (const c of campos) if (origem?.[c] !== undefined) resultado[c] = origem[c];
  return resultado;
}

function usuarioPublico(u: any) {
  return { id: u.id, nome: u.nome, email: u.email, tipoUsuario: u.tipoUsuario };
}

// POST /api/auth/registrar
router.post("/registrar", async (req, res) => {
  try {
    const { nome, email, senha, telefone, tipoUsuario, artista, cliente, empresa } = req.body;

    if (!nome || !email || !senha || String(senha).length < 6) {
      return res.status(400).json({ erro: "Informe nome, e-mail e uma senha de pelo menos 6 caracteres." });
    }
    if (!TIPOS_PERMITIDOS.includes(tipoUsuario)) {
      return res.status(400).json({ erro: "Tipo de usuário inválido." });
    }

    const usuario = await User.create({
      nome,
      email,
      senha, // o hash é feito automaticamente no model (pre "save")
      telefone,
      tipoUsuario,
      artista:
        tipoUsuario === "artista"
          ? pegar(artista, ["nomeArtistico", "biografia", "cidade", "estado", "categoriaArtistica"])
          : undefined,
      cliente: tipoUsuario === "cliente" ? pegar(cliente, ["cpf", "nomeCompleto", "cidade", "estado"]) : undefined,
      empresa:
        tipoUsuario === "empresa"
          ? pegar(empresa, ["razaoSocial", "nomeFantasia", "cnpj", "emailContato", "descricao", "site", "cidade", "estado"])
          : undefined,
    });

    res.status(201).json({ token: gerarToken(usuario.id, usuario.tipoUsuario), usuario: usuarioPublico(usuario) });
  } catch (e: any) {
    if (e.code === 11000) return res.status(409).json({ erro: "E-mail, CPF ou CNPJ já cadastrado." });
    if (e.name === "ValidationError") return res.status(400).json({ erro: e.message });
    console.error(e);
    res.status(500).json({ erro: "Erro interno do servidor." });
  }
});

// POST /api/auth/login
router.post("/login", async (req, res) => {
  try {
    const { email, senha } = req.body;
    if (!email || !senha) return res.status(400).json({ erro: "Informe e-mail e senha." });

    // .select("+senha") porque no model a senha vem escondida por padrão
    const usuario = await User.findOne({ email: String(email).toLowerCase() }).select("+senha");

    // Mesma mensagem para "não existe" e "senha errada" (não revela quais e-mails existem)
    if (!usuario || !(await bcrypt.compare(String(senha), usuario.senha))) {
      return res.status(401).json({ erro: "E-mail ou senha inválidos." });
    }
    if (usuario.status !== "ativo") return res.status(403).json({ erro: "Conta desativada." });

    res.json({ token: gerarToken(usuario.id, usuario.tipoUsuario), usuario: usuarioPublico(usuario) });
  } catch (e) {
    console.error(e);
    res.status(500).json({ erro: "Erro interno do servidor." });
  }
});

export default router;
