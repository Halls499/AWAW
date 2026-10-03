import { Schema, model } from "mongoose";

// AVALIACAO => coleção "avaliacaos"
const avaliacaoSchema = new Schema(
  {
    artista: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    avaliador: { type: Schema.Types.ObjectId, ref: "User", required: true },
    contratacao: { type: Schema.Types.ObjectId, ref: "Contratacao", required: true },
    nota: { type: Number, required: true, min: 1, max: 5 },
    comentario: String,
    status: { type: String, enum: ["pendente", "publicada", "removida"], default: "publicada" },
  },
  { timestamps: { createdAt: "dataAvaliacao", updatedAt: "atualizadoEm" } }
);

// Um avaliador só pode avaliar a mesma contratação uma vez
avaliacaoSchema.index({ contratacao: 1, avaliador: 1 }, { unique: true });

export const Avaliacao = model("Avaliacao", avaliacaoSchema);
