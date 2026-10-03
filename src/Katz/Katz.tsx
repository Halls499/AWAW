import "./style.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

type Obra = {
  id: number;
  titulo: string;
  descricao: string;
  preco: string;
};

// Edite aqui o título, a descrição e o preço de cada obra.
const obras: Obra[] = [
  {
    id: 1,
    titulo: "Royalty",
    descricao: "Descrição da obra 1: técnica, tamanho e inspiração.",
    preco: "R$50,00",
  },
  {
    id: 2,
    titulo: "Is the revolution",
    descricao: "Descrição da obra 2: técnica, tamanho e inspiração.",
    preco: "R$50,00",
  },
  {
    id: 3,
    titulo: "Dead Nature",
    descricao: "Descrição da obra Dead Nature: técnica, tamanho e inspiração.",
    preco: "R$50,00",
  },
  {
    id: 4,
    titulo: "Vivi Aurum",
    descricao: "Descrição da obra Vivi Aurum: técnica, tamanho e inspiração.",
    preco: "R$50,00",
  },
  {
    id: 5,
    titulo: "Obra 5",
    descricao: "Descrição da obra 5: técnica, tamanho e inspiração.",
    preco: "R$50,00",
  },
  {
    id: 6,
    titulo: "Lost Heaven",
    descricao: "Descrição da obra Lost Heaven: técnica, tamanho e inspiração.",
    preco: "R$50,00",
  },
  {
    id: 7,
    titulo: "Obra 7",
    descricao: "Descrição da obra 7: técnica, tamanho e inspiração.",
    preco: "R$50,00",
  },
  {
    id: 8,
    titulo: "Obra 8",
    descricao: "Descrição da obra 8: técnica, tamanho e inspiração.",
    preco: "R$50,00",
  },
  {
    id: 9,
    titulo: "Vivi Aurum",
    descricao: "Descrição da obra Vivi Aurum: técnica, tamanho e inspiração.",
    preco: "R$50,00",
  },
  {
    id: 10,
    titulo: "Obra 10",
    descricao: "Descrição da obra 10: técnica, tamanho e inspiração.",
    preco: "R$50,00",
  },
  {
    id: 11,
    titulo: "Obra 11",
    descricao: "Descrição da obra 11: técnica, tamanho e inspiração.",
    preco: "R$50,00",
  },
  {
    id: 12,
    titulo: "Gloow",
    descricao: "Descrição da obra Gloow: técnica, tamanho e inspiração.",
    preco: "R$50,00",
  },
];

function Kat() {
  return (
    <div className="katz-page">
      <Navbar />

      <main>
        {/* PERFIL */}
        <section className="katz-perfil">
          <div className="katz-container katz-perfil-grid">
            <div className="katz-perfil-texto">
              <h1 className="katz-titulo">
                Olá, meu nome é{" "}
                <span className="katz-destaque">
                  <span className="katz-destaque-texto">Katz</span>
                </span>
              </h1>

              <p>
                Sou uma artista apaixonada por criar experiências visuais
                únicas. Meu trabalho combina cores vibrantes, formas abstratas e
                elementos interativos para envolver o público de maneira
                cativante.
              </p>
              <p>
                Acredito que a arte tem o poder de transformar espaços e
                provocar emoções. Cada projeto que realizo é uma oportunidade de
                explorar novas ideias e desafiar os limites da criatividade.
              </p>
              <p>
                Se você está procurando uma artista que traga inovação e
                originalidade para seus projetos, estou pronta para colaborar e
                criar algo extraordinário juntos.
              </p>

              <div className="katz-botoes">
                <button className="katz-btn katz-btn-primario">
                  Contratar artista
                </button>
                <a href="#obras" className="katz-btn katz-btn-secundario">
                  Ver obras
                </a>
              </div>
            </div>

            <div className="katz-perfil-foto">
              <div className="katz-foto-moldura">
                <img
                  src="../../public/img/Katz/Retrato Kat (2).jpeg"
                  alt="Retrato da artista Katz"
                />
              </div>
              <div className="katz-foto-legenda">
                <strong>Katz</strong>
                <span>Artista visual</span>
              </div>
            </div>
          </div>
        </section>

        {/* OBRAS */}
        <section id="obras" className="katz-obras">
          <div className="katz-container">
            <div className="katz-secao-cabecalho">
              <h2>Obras</h2>
              <p>Conheça os trabalhos da Katz e escolha o seu favorito.</p>
            </div>

            <div className="katz-grid">
              {obras.map((obra) => (
                <article className="katz-card" key={obra.id}>
                  <a href={`/katz/obra${obra.id}`} className="katz-card-imagem">
                    <img
                      src={`/img/Katz/obra ${obra.id}.jpeg`}
                      alt={obra.titulo}
                      loading="lazy"
                    />
                  </a>

                  <div className="katz-card-corpo">
                    <h3>{obra.titulo}</h3>
                    <p>{obra.descricao}</p>

                    <div className="katz-card-rodape">
                      <span className="katz-preco">{obra.preco}</span>

                      <a
                        href={`/katz/obra${obra.id}`}
                        className="katz-link-obra"
                      >
                        Ver obra
                      </a>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* CONTRATAR */}
        <section className="katz-contratar">
          <div className="katz-container">
            <div className="katz-contratar-caixa">
              <h2>Quer uma obra feita para o seu projeto?</h2>
              <p>Fale com a Katz e conte sua ideia.</p>
              <button className="katz-btn katz-btn-primario">
                Contratar artista
              </button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

export default Kat;
