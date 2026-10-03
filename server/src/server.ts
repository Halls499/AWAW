import "dotenv/config"; // precisa ser o PRIMEIRO import: carrega o .env
import express from "express";
import cors from "cors";
import { conectarBanco } from "./db";
import authRoutes from "./routes/auth";
import artistasRoutes from "./routes/artistas";

const app = express();

app.use(cors({ origin: "http://localhost:5173" })); // endereço do Vite
app.use(express.json()); // permite ler o corpo (body) das requisições em JSON

app.get("/api/saude", (_req, res) => res.json({ ok: true }));
app.use("/api/auth", authRoutes);
app.use("/api/artistas", artistasRoutes);

const porta = Number(process.env.PORT) || 3001;

conectarBanco()
  .then(() => app.listen(porta, () => console.log(`API rodando em http://localhost:${porta}`)))
  .catch((erro) => {
    console.error("Falha ao conectar no MongoDB:", erro.message);
    process.exit(1);
  });
