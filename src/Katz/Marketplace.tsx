import "./style.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

type Obra = {
  id: number;
  titulo: string;
  preco: string;
};

// Definição das obras
const obras: Obra[] = [
  {
    id: 1,
    titulo: "Royalty",
    preco: "R$ 1.000,00",
  },
  {
    id: 2,
    titulo: "Is the revolution",
    preco: "R$ 1.500,00",
  },
  {
    id: 3,
    titulo: "Dead Nature",
    preco: "R$ 2.000,00",
  },
  {
    id: 4,
    titulo: "Vivi Aurum",
    preco: "R$ 2.500,00",
  },
  {
    id: 5,
    titulo: "Obra 5",
    preco: "R$ 3.000,00",
  },
  {
    id: 6,
    titulo: "Lost Heaven",
    preco: "R$ 3.500,00",
  },
  {
    id: 7,
    titulo: "Obra 7",
    preco: "R$ 4.000,00",
  },
  {
    id: 8,
    titulo: "Obra 8",
    preco: "R$ 4.500,00",
  },
  {
    id: 9,
    titulo: "Vivi Aurum",
    preco: "R$ 5.000,00",
  },
  {
    id: 10,
    titulo: "Obra 10",
    preco: "R$ 5.500,00",
  },
  {
    id: 11,
    titulo: "Obra 11",
    preco: "R$ 6.000,00",
  },
  {
    id: 12,
    titulo: "Gloow",
    preco: "R$ 6.500,00",
  },
];

function Marketplace() {
  return (
    <div className="katz-page">
      <Navbar />

      {/* OBRAS */}
      <section id="obras" className="katz-obras">
        <div className="katz-container">
          <div className="katz-secao-cabecalho">
            <h2>Compre as obras de Katz</h2>
          </div>

          <div className="katz-grid">
            {obras.map((obra) => (
              <article className="katz-card" key={obra.id}>
                  <img
                    src={`/img/Katz/obra ${obra.id}.jpeg`}
                    alt={obra.titulo}
                    loading="lazy"
                  />

                <div className="katz-card-corpo">
                  <h3>{obra.titulo}</h3>
                  <p>{obra.preco}</p>

                  <div className="katz-card-rodape">
                    <a
                      href={`/katz/marketplace/obra${obra.id}`}
                      className="katz-link-obra"
                    >
                      Comprar obra
                    </a>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
        <center><br></br><br></br>
        <a href="/katz" className="katz-btn katz-btn-primario">
          Voltar à artista
        </a>
        </center>
      </section>

      <Footer />
    </div>
  );
}

export default Marketplace;
