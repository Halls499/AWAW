import mongoose from "mongoose";

// Abre a conexão com o MongoDB. O Mongoose mantém essa conexão
// aberta e reaproveita em todas as consultas do servidor.
export async function conectarBanco() {
  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error("MONGODB_URI não definido no arquivo .env");

  await mongoose.connect(uri);
  console.log(`MongoDB conectado (banco: ${mongoose.connection.name})`);
}
