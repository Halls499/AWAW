import { Schema, model } from "mongoose";

// PAGAMENTO => coleção "pagamentos". Pode pagar um PEDIDO *ou* uma CONTRATACAO.
const pagamentoSchema = new Schema(
  {
    pedido: { type: Schema.Types.ObjectId, ref: "Pedido", index: true },
    contratacao: { type: Schema.Types.ObjectId, ref: "Contratacao", index: true },
    valor: { type: Number, required: true, min: 0 },
    formaPagamento: { type: String, enum: ["pix", "cartao_credito", "cartao_debito", "boleto"] },
    dataPagamento: Date,
    status: { type: String, enum: ["pendente", "aprovado", "recusado", "estornado"], default: "pendente" },
    codigoTransacao: String,
  },
  { timestamps: true }
);

// Regra: precisa ter pedido OU contratação (exatamente um dos dois)
pagamentoSchema.pre("validate", function () {
  if (!!this.pedido === !!this.contratacao) {
    this.invalidate("pedido", "Informe um pedido OU uma contratação (apenas um).");
  }
});

export const Pagamento = model("Pagamento", pagamentoSchema);
