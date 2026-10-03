import { Schema, model } from "mongoose";

/*
  PORTFOLIO + TRABALHO => coleção "portfolios", com os trabalhos EMBUTIDOS
  em um array. Um portfólio é sempre lido junto com seus trabalhos, então
  não faz sentido separar em duas coleções.
*/

const trabalhoSchema = new Schema(
  {
    titulo: { type: String, required: true },
    descricao: String,
    tipoTrabalho: String,
    imagem: String, // URL
    video: String, // URL
    linkExterno: String,
    dataPublicacao: Date,
    // "publicado" por padrão para facilitar testes
    status: { type: String, enum: ["rascunho", "publicado", "arquivado"], default: "publicado" },
  },
  { timestamps: { createdAt: "dataCriacao", updatedAt: "atualizadoEm" } }
);

const portfolioSchema = new Schema(
  {
    // id_artista (FK) => referência ao _id do usuário artista
    artista: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    titulo: { type: String, required: true },
    descricao: String,
    trabalhos: [trabalhoSchema],
  },
  { timestamps: { createdAt: "dataCriacao", updatedAt: "dataAtualizacao" } }
);

export const Portfolio = model("Portfolio", portfolioSchema);
