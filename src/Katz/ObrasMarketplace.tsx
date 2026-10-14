import { useParams } from "react-router-dom";
import "./style.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { obras } from "./Obras";

function ObraMarketplace() {
  const { obraId } = useParams();

  const obra = obraId ? obras[obraId as keyof typeof obras] : undefined;

  if (!obra) {
    return <h1>Obra não encontrada</h1>;
  }

  return (
    <div className="katz-page">
      <Navbar />

      <main className="katz-detalhe-container">
        <section className="katz-detalhe-obra">
          <div className="katz-detalhe-imagem">
            <img src={obra.imagem} alt={obra.alt} />
          </div>

          <div className="katz-detalhe-info">
            <h1>{obra.titulo}</h1>
            <p className="katz-detalhe-preco">{obra.preco}</p>
            <p className="katz-detalhe-descricao">{obra.descricao}</p>
            <div className="katz-botoes">
              <button className="katz-btn katz-btn-primario">
                Comprar obra
              </button>
              <a
                href="/katz/marketplace"
                className="katz-btn katz-btn-secundario"
              >
                Voltar ao marketplace
              </a>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

export default ObraMarketplace;
