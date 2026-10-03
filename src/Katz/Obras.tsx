import "./style.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

interface ObraProps {
  titulo: string;
  imagem: string;
  alt: string;
  descricao: string;
}

function Obra({ titulo, imagem, alt, descricao }: ObraProps) {
  return (
    <div className="katz-page">
      <Navbar />

      <main>
        <h1 className="titulo">{titulo}</h1>

        <div className="obra-layout">
          <div className="obra-imagem-container">
            <img src={imagem} alt={alt} className="obra-image" />

            <p className="preco">R$ 50,00</p>
          </div>

          <div className="obra-info">
            <div className="content">
              <p>
                <b>{descricao}</b>
              </p>
            </div>

            <div className="buttons-container">
              <button className="btn-artista">Comprar trabalho</button>

              <a href="/katz" className="btn-back">
                Voltar à artista
              </a>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default Obra;
