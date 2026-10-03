import { Schema, model } from "mongoose";

// FAVORITO => coleção "favoritos". Favorita um artista OU um produto.
const favoritoSchema = new Schema(
  {
    usuario: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    artista: { type: Schema.Types.ObjectId, ref: "User" },
    produto: { type: Schema.Types.ObjectId, ref: "Produto" },
  },
  { timestamps: { createdAt: "dataFavorito", updatedAt: false } }
);

favoritoSchema.pre("validate", function () {
  if (!!this.artista === !!this.produto) {
    this.invalidate("artista", "Informe um artista OU um produto (apenas um).");
  }
});

// Impede favoritar duas vezes o mesmo item
favoritoSchema.index(
  { usuario: 1, artista: 1 },
  { unique: true, partialFilterExpression: { artista: { $type: "objectId" } } }
);
favoritoSchema.index(
  { usuario: 1, produto: 1 },
  { unique: true, partialFilterExpression: { produto: { $type: "objectId" } } }
);

export const Favorito = model("Favorito", favoritoSchema);
