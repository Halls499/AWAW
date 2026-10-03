import { Schema, model } from "mongoose";

/*
  CONTRATACAO + EVENTO + CONTRATO => coleção "contratacaos".
  Evento e contrato são 1:1 com a contratação, então ficam embutidos.
*/
const eventoSchema = new Schema(
  {
    nome: String,
    descricao: String,
    dataEvento: Date,
    horaInicio: String, // "19:30"
    horaFim: String,
    local: String,
    cidade: String,
    estado: String,
    quantidadeConvidados: Number,
    tipoEvento: String,
  },
  { _id: false }
);

const contratoSchema = new Schema(
  {
    numeroContrato: String,
    dataAssinatura: Date,
    dataInicio: Date,
    dataFim: Date,
    valorTotal: Number,
    condicoes: String,
    status: { type: String, enum: ["rascunho", "aguardando_assinatura", "assinado", "cancelado"], default: "rascunho" },
    arquivoContrato: String, // URL do PDF
  },
  { _id: false }
);

const contratacaoSchema = new Schema(
  {
    artista: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    contratante: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    tipoContratacao: String,
    titulo: { type: String, required: true },
    descricao: String,
    valor: { type: Number, min: 0 },
    dataInicio: Date,
    dataFim: Date,
    status: {
      type: String,
      enum: ["solicitada", "aceita", "recusada", "em_andamento", "concluida", "cancelada"],
      default: "solicitada",
    },
    formaPagamento: String,
    evento: eventoSchema,
    contrato: contratoSchema,
  },
  { timestamps: { createdAt: "dataSolicitacao", updatedAt: "atualizadoEm" } }
);

contratacaoSchema.index({ "contrato.numeroContrato": 1 }, { unique: true, sparse: true });

export const Contratacao = model("Contratacao", contratacaoSchema);
