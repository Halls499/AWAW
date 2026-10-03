import { Schema, model } from "mongoose";

// CONVERSA => coleção "conversas"
const conversaSchema = new Schema(
  {
    artista: { type: Schema.Types.ObjectId, ref: "User", required: true },
    usuario: { type: Schema.Types.ObjectId, ref: "User", required: true },
    status: { type: String, enum: ["ativa", "arquivada"], default: "ativa" },
  },
  { timestamps: { createdAt: "dataCriacao", updatedAt: "atualizadoEm" } }
);
conversaSchema.index({ artista: 1, usuario: 1 }, { unique: true }); // 1 conversa por par

export const Conversa = model("Conversa", conversaSchema);

/*
  MENSAGEM => coleção "mensagems" (SEPARADA, não embutida em conversa).
  Motivo: uma conversa pode ter milhares de mensagens, e um documento do
  Mongo tem limite de 16 MB. Coisa que cresce sem parar fica em coleção própria.
*/
const mensagemSchema = new Schema(
  {
    conversa: { type: Schema.Types.ObjectId, ref: "Conversa", required: true },
    remetente: { type: Schema.Types.ObjectId, ref: "User", required: true },
    conteudo: { type: String, required: true },
    visualizada: { type: Boolean, default: false },
  },
  { timestamps: { createdAt: "dataEnvio", updatedAt: false } }
);
mensagemSchema.index({ conversa: 1, dataEnvio: 1 }); // histórico em ordem

export const Mensagem = model("Mensagem", mensagemSchema);
