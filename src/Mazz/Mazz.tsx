import "./style.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

type Obra = {
  id: number;
  titulo: string;
  descricao: string;
  preco: string;
};

const obras: Obra[] = [
  {
    id: 1,
    titulo: "",
    descricao: "",
    preco: "R$50",
  },
  {
    id: 2,
    titulo: "",
    descricao: "",
    preco: "R$50",
  },
  {
    id: 3,
    titulo: "",
    descricao: "",
    preco: "R$50",
  },
  {
    id: 4,
    titulo: "",
    descricao: "",
    preco: "R$50",
  },
  {
    id: 5,
    titulo: "",
    descricao: "",
    preco: "R$50",
  },
  {
    id: 6,
    titulo: "",
    descricao: "",
    preco: "R$50",
  },
  {
    id: 7,
    titulo: "",
    descricao: "",
    preco: "R$50",
  },
  {
    id: 8,
    titulo: "",
    descricao: "",
    preco: "R$50",
  },
  {
    id: 9,
    titulo: "",
    descricao: "",
    preco: "R$50",
  },
  {
    id: 10,
    titulo: "",
    descricao: "",
    preco: "R$50",
  },
  {
    id: 11,
    titulo: "",
    descricao: "",
    preco: "R$50",
  },
  {
    id: 12,
    titulo: "",
    descricao: "",
    preco: "R$50",
  },
];

function Mazz() {
  return (
    <div className="mazz-page">
      <Navbar />

      <main>
        {/* PERFIL */}
        <section className="mazz-perfil">
          <div className="mazz-container mazz-perfil-grid">
            <div className="mazz-perfil-texto">
              <h1 className="mazz-titulo">
                Olá, meu nome é{" "}
                <span className="mazz-destaque">
                  <span className="mazz-destaque-texto">Mazz</span>
                </span>
              </h1>

              <p>
                Eu sou o Mazz e componho desde 2020. Ao longo desses anos, já
                criei mais de 70 composições entre poemas e músicas de
                diferentes gêneros. Não tenho um estilo fixo e gosto de
                transitar entre rap, trap, funk, R&B e love songs, explorando
                diferentes formas de expressão.
              </p>

              <p>
                Grande parte das minhas composições nasce dos sentimentos. Gosto
                de transformar em música aquilo que sinto, falando sobre amor,
                saudade, tristeza, alegria, esperança e desilusão. Para mim, a
                música é uma forma de colocar em palavras aquilo que muitas
                vezes é difícil expressar.
              </p>

              <p>
                Também gosto de trabalhar com contradições, criar cenários e
                desenvolver histórias. Acho interessante imaginar situações e
                transformar o que existe no imaginário em versos, criando
                diferentes perspectivas dentro de uma mesma composição.
              </p>

              <div className="mazz-botoes">
                <button className="mazz-btn mazz-btn-primario">
                  Contratar artista
                </button>

                <a href="#obras" className="mazz-btn mazz-btn-secundario">
                  Ver obras
                </a>
              </div>
            </div>

            <div className="mazz-perfil-foto">
              <div className="mazz-foto-moldura">
                <img
                  src="../../public/img/mazz/Retrato Kat (2).jpeg"
                  alt="Retrato da artista mazz"
                />
              </div>

              <div className="mazz-foto-legenda">
                <strong>mazz</strong>
                <span>Artista visual</span>
              </div>
            </div>
          </div>
        </section>

        {/* OBRAS */}
        <section id="obras" className="mazz-obras">
          <div className="mazz-container">
            <div className="mazz-secao-cabecalho">
              <h2>Obras</h2>
              <p>Conheça alguns dos trabalhos da artista.</p>
            </div>

            <div className="mazz-obras-grid">
              {obras.map((obra) => (
                <article className="mazz-card" key={obra.id}>
                  <div className="mazz-card-corpo">
                    <h3>{obra.titulo}</h3>

                    <p>{obra.descricao}</p>

                    <div className="mazz-card-rodape">
                      <span className="mazz-preco">{obra.preco}</span>

                      <a
                        href={`/mazz/obra${obra.id}`}
                        className="mazz-link-obra"
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
      </main>

      <Footer />
    </div>
  );
}

export default Mazz;
