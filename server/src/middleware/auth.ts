import jwt from "jsonwebtoken";
import type { Request, Response, NextFunction } from "express";

function segredo() {
  const s = process.env.JWT_SECRET;
  if (!s) throw new Error("JWT_SECRET não definido no arquivo .env");
  return s;
}

// Cria o "crachá" (token) que o front guarda depois do login
export function gerarToken(id: string, tipoUsuario: string) {
  return jwt.sign({ tipoUsuario }, segredo(), { subject: id, expiresIn: "7d" });
}

// Use em rotas que exigem login: router.put("/me", exigirLogin, ...)
// O front manda o cabeçalho:  Authorization: Bearer <token>
export function exigirLogin(req: Request, res: Response, next: NextFunction) {
  const cabecalho = req.headers.authorization;
  if (!cabecalho?.startsWith("Bearer ")) {
    return res.status(401).json({ erro: "Faça login para continuar." });
  }
  try {
    const dados = jwt.verify(cabecalho.slice(7), segredo()) as jwt.JwtPayload;
    res.locals.usuario = { id: dados.sub, tipoUsuario: dados.tipoUsuario };
    next();
  } catch {
    res.status(401).json({ erro: "Sessão inválida ou expirada." });
  }
}
