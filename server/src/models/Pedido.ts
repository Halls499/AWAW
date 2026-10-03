import { Schema, model } from "mongoose";

/*
  PEDIDO + ITEM_PEDIDO => coleção "pedidos" com os itens EMBUTIDOS.
  Cada item guarda uma "foto" do nome e do preço no momento da compra:
  se o artista mudar o preço depois, o pedido antigo continua correto.
*/
const itemSchema = new Schema({
  produto: { type: Schema.Types.ObjectId, ref: "Produto", required: true },
  nome: String,
  quantidade: { type: Number, required: true, min: 1 },
  precoUnitario: { type: Number, required: true, min: 0 },
  subtotal: { type: Number, required: true, min: 0 },
});

const pedidoSchema = new Schema(
  {
    comprador: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    itens: { type: [itemSchema], validate: (v: unknown[]) => v.length > 0 },
    valorTotal: { type: Number, required: true, min: 0 },
    statusPedido: {
      type: String,
      enum: ["pendente", "pago", "enviado", "entregue", "cancelado"],
      default: "pendente",
    },
    formaPagamento: { type: String, enum: ["pix", "cartao_credito", "cartao_debito", "boleto"] },
    statusPagamento: {
      type: String,
      enum: ["pendente", "aprovado", "recusado", "estornado"],
      default: "pendente",
    },
  },
  { timestamps: { createdAt: "dataPedido", updatedAt: "atualizadoEm" } }
);

export const Pedido = model("Pedido", pedidoSchema);
