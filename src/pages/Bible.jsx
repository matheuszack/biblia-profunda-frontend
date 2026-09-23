import { useEffect, useState } from "react";
import { BookOpen } from "lucide-react";
import Sidebar from "../components/Sidebar";

function Bible() {
  const [livros, setLivros] = useState([]);
  const [livroSelecionado, setLivroSelecionado] = useState("");
  const [capitulos, setCapitulos] = useState([]);
  const [capituloSelecionado, setCapituloSelecionado] = useState(3);
  const [versiculos, setVersiculos] = useState([]);
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState("");

  // Buscar lista de livros
  useEffect(() => {
    fetch("http://localhost:3000/api/biblia/livros")
      .then((response) => response.json())
      .then((data) => {
        setLivros(data);

        // Seleciona automaticamente o primeiro livro
        if (data.length > 0) {
          setLivroSelecionado(data[0].nome);
        }
      })
      .catch((error) => {
        console.error("Erro ao buscar livros:", error);
        setErro("Não foi possível carregar os livros.");
      });
  }, []);

  useEffect(() => {
  if (!livroSelecionado) {
    return;
  }

  fetch(
    `http://localhost:3000/api/biblia/livros/${encodeURIComponent(
      livroSelecionado
    )}/capitulos`
  )
    .then((response) => {
      if (!response.ok) {
        throw new Error("Capítulos não encontrados.");
      }

      return response.json();
    })
    .then((data) => {
      setCapitulos(data);

      if (data.length > 0) {
        setCapituloSelecionado(data[0]);
      }
    })
    .catch((error) => {
      console.error("Erro ao buscar capítulos:", error);
      setCapitulos([]);
      setCapituloSelecionado("");
    });
}, [livroSelecionado]);

  // Buscar capítulo
  useEffect(() => {
    if (!livroSelecionado || !capituloSelecionado) {
      return;
    }

    setCarregando(true);
    setErro("");

    fetch(
      `http://localhost:3000/api/biblia/${encodeURIComponent(
        livroSelecionado
      )}/${capituloSelecionado}`
    )
      .then((response) => {
        if (!response.ok) {
          throw new Error("Capítulo não encontrado.");
        }

        return response.json();
      })
      .then((data) => {
        setVersiculos(data.versiculos);
      })
      .catch((error) => {
        console.error("Erro ao buscar capítulo:", error);
        setVersiculos([]);
        setErro("Não foi possível carregar esse capítulo.");
      })
      .finally(() => {
        setCarregando(false);
      });
  }, [livroSelecionado, capituloSelecionado]);

  return (
    <div className="app-layout">
      <Sidebar />

      <main className="page-content">
        <div className="page-header">
          <div className="page-icon">
            <BookOpen size={28} />
          </div>

          <div>
            <h1>Bíblia</h1>
            <p>Leia e explore as Escrituras.</p>
          </div>
        </div>

        <div className="bible-reader">

          <div className="bible-controls">

            {/* Livro */}
            <div className="bible-field">
              <label>Livro</label>

              <select
                value={livroSelecionado}
                onChange={(e) => setLivroSelecionado(e.target.value)}
              >
                {livros.map((livro) => (
                  <option key={livro.abreviacao} value={livro.nome}>
                    {livro.nome}
                  </option>
                ))}
              </select>
            </div>

            {/* Capítulo */}
            <div className="bible-field">
              <label>Capítulo</label>

              <select
                value={capituloSelecionado}
                onChange={(e) =>
                  setCapituloSelecionado(Number(e.target.value))
                }
              >
                {capitulos.map((capitulo) => (
                  <option key={capitulo} value={capitulo}>
                    {capitulo}
                  </option>
                ))}
              </select>
            </div>

          </div>

          {/* Conteúdo */}
          <div className="bible-content">

            <h2>
              {livroSelecionado} {capituloSelecionado}
            </h2>

            {carregando && (
              <p>Carregando capítulo...</p>
            )}

            {erro && (
              <p className="ai-error">{erro}</p>
            )}

            {!carregando && !erro && (
              <div className="verses">
                {versiculos.map((versiculo) => (
                  <p key={versiculo.numero}>
                    <strong>{versiculo.numero}</strong>{" "}
                    {versiculo.texto}
                  </p>
                ))}
              </div>
            )}

          </div>

        </div>
      </main>
    </div>
  );
}

export default Bible;