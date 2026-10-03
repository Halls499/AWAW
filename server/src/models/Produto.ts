import { Schema, model } from "mongoose";

// CATEGORIA_PRODUTO => coleção "categoriaprodutos"
const categoriaSchema = new Schema({
  nome: { type: String, required: true, unique: true },
  descricao: String,
  status: { type: String, enum: ["ativo", "inativo"], default: "ativo" },
});
export const CategoriaProduto = model("CategoriaProduto", categoriaSchema);

// PRODUTO => coleção "produtos". peso/altura/largura/profundidade viram um
// objeto "dimensoes" só para organizar.
const produtoSchema = new Schema(
  {
    artista: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    categoria: { type: Schema.Types.ObjectId, ref: "CategoriaProduto", index: true },
    nome: { type: String, required: true },
    descricao: String,
    // Dica: em sistemas com pagamento real, guarde dinheiro em CENTAVOS (inteiro)
    // para evitar erros de arredondamento. Aqui deixei em reais para ficar simples.
    preco: { type: Number, required: true, min: 0 },
    quantidade: { type: Number, default: 1, min: 0 },
    tipoProduto: String,
    imagem: String,
    dimensoes: { peso: Number, altura: Number, largura: Number, profundidade: Number },
    dataPublicacao: Date,
    status: { type: String, enum: ["rascunho", "ativo", "esgotado", "inativo"], default: "ativo" },
  },
  { timestamps: true }
);

export const Produto = model("Produto", produtoSchema);
