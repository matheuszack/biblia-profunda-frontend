import { useEffect, useRef, useState } from "react";
import { BookOpen, LoaderCircle, Search, X } from "lucide-react";
import ReactMarkdown from "react-markdown";
import Sidebar from "../components/Sidebar";


function Bible() {
  const [livros, setLivros] = useState([]);
  const [livroSelecionado, setLivroSelecionado] = useState("");
  const [capitulos, setCapitulos] = useState([]);
  const [capituloSelecionado, setCapituloSelecionado] = useState(3);
  const [versiculos, setVersiculos] = useState([]);
  const [versiculoSelecionado, setVersiculoSelecionado] = useState(null);
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState("");
  const [respostaIA, setRespostaIA] = useState("");
  const [carregandoIA, setCarregandoIA] = useState(false);
  const [erroIA, setErroIA] = useState("");
  const [termoBusca, setTermoBusca] = useState("");
  const [resultadosBusca, setResultadosBusca] = useState([]);
  const [totalResultados, setTotalResultados] = useState(0);
  const [buscaEnviada, setBuscaEnviada] = useState(false);
  const [carregandoBusca, setCarregandoBusca] = useState(false);
  const [erroBusca, setErroBusca] = useState("");
  const [quantidadeExibida, setQuantidadeExibida] = useState(5);
  const [termoPesquisado, setTermoPesquisado] = useState("");

const buscaController = useRef(null);
const navegacaoPendenteRef = useRef(null);


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

  // Buscar capítulos
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
    const destino = navegacaoPendenteRef.current;

    if (
      destino &&
      destino.livro === livroSelecionado &&
      data.includes(destino.capitulo)
    ) {
      setCapituloSelecionado(destino.capitulo);
    } else {
      setCapituloSelecionado(data[0]);
    }
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

  const destino = navegacaoPendenteRef.current;

  if (
    destino &&
    destino.livro === livroSelecionado &&
    destino.capitulo === Number(capituloSelecionado)
  ) {
    setVersiculoSelecionado(destino.versiculo);
    navegacaoPendenteRef.current = null;
  } else {
    setVersiculoSelecionado(null);
  }
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


async function pesquisarBiblia() {
  const termo = termoBusca.trim();

  if (termo.length < 2) {
    buscaController.current?.abort();
    buscaController.current = null;
    setBuscaEnviada(false);
    setCarregandoBusca(false);
    setResultadosBusca([]);
    setTotalResultados(0);
    setQuantidadeExibida(5);
    setErroBusca("Digite pelo menos 2 caracteres para pesquisar.");
    return;
  }

  buscaController.current?.abort();
  const controller = new AbortController();
  buscaController.current = controller;
  setTermoPesquisado(termo);
  setBuscaEnviada(true);
  setCarregandoBusca(true);
  setErroBusca("");
  setResultadosBusca([]);
  setTotalResultados(0);
  setQuantidadeExibida(5);

  try {
    const response = await fetch(
      `http://localhost:3000/api/biblia/buscar?termo=${encodeURIComponent(termo)}`,
      { signal: controller.signal }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.erro || "Erro ao pesquisar.");
    }

    setResultadosBusca(data.resultados);
    setTotalResultados(data.total);
  } catch (error) {
    if (error.name === "AbortError") return;
    console.error("Erro na pesquisa bíblica:", error);
    setErroBusca("Não foi possível concluir a pesquisa. Tente novamente.");
  } finally {
    if (!controller.signal.aborted) {
      setCarregandoBusca(false);
      buscaController.current = null;
    }
  }
}

function cancelarPesquisa() {
  buscaController.current?.abort();
  buscaController.current = null;
  setBuscaEnviada(false);
  setCarregandoBusca(false);
  setErroBusca("");
  setTermoBusca("");
  setTermoPesquisado("");
  setResultadosBusca([]);
  setTotalResultados(0);
  setQuantidadeExibida(5);
}
function abrirVersiculoPesquisado(item) {
  const destino = {
    livro: item.livro,
    capitulo: Number(item.capitulo),
    versiculo: Number(item.versiculo),
  };

  setRespostaIA("");
  setErroIA("");

  cancelarPesquisa();

  // Se o capítulo já estiver aberto, basta selecionar o versículo.
  if (
    destino.livro === livroSelecionado &&
    destino.capitulo === Number(capituloSelecionado)
  ) {
    navegacaoPendenteRef.current = null;
    setVersiculoSelecionado(destino.versiculo);
    return;
  }

  // Guarda o destino enquanto o livro e o capítulo são carregados.
  navegacaoPendenteRef.current = destino;

  setLivroSelecionado(destino.livro);
  setCapituloSelecionado(destino.capitulo);
}


  async function estudarVersiculo() {
  if (!versiculoSelecionado) return;

  const versiculo = versiculos.find(
    (item) => item.numero === versiculoSelecionado
  );

  if (!versiculo) return;

const indiceVersiculo = versiculos.findIndex(
  (item) => item.numero === versiculoSelecionado
);

const inicio = Math.max(0, indiceVersiculo - 2);
const fim = Math.min(versiculos.length, indiceVersiculo + 3);

const contexto = versiculos.slice(inicio, fim);

const textoContexto = contexto
  .map(
    (item) =>
      `${livroSelecionado} ${capituloSelecionado}:${item.numero} — ${item.texto}`
  )
  .join("\n");
  
  setCarregandoIA(true);
  setRespostaIA("");
  setErroIA("");

 const pergunta = `
Você é o assistente de estudos bíblicos da aplicação Bíblia Profunda AI.

Estou estudando especificamente:

Livro: ${livroSelecionado}
Capítulo: ${capituloSelecionado}
Versículo: ${versiculoSelecionado}

Texto do versículo selecionado:
${versiculo.texto}

Abaixo está o contexto próximo do versículo, contendo alguns versículos
anteriores e posteriores:

${textoContexto}

Analise EXCLUSIVAMENTE o versículo ${livroSelecionado} ${capituloSelecionado}:${versiculoSelecionado}
como o versículo principal do estudo.

Use os outros versículos fornecidos apenas para compreender o contexto.

Não confunda o número do versículo principal com os versículos de contexto.

Explique:
- o significado do versículo;
- o contexto imediato;
- conceitos importantes presentes no texto;
- possíveis interpretações cristãs quando houver diferenças relevantes;
- relações com outras passagens bíblicas quando forem realmente pertinentes;
- uma aplicação prática para o estudo.

Diferencie claramente o que o texto bíblico afirma de interpretações,
inferências ou aplicações.

Não invente informações, referências bíblicas ou contexto histórico.
Se houver alguma incerteza, deixe isso claro.

Organize a resposta de forma didática usando títulos e listas quando forem úteis.
`;
  try {
    const response = await fetch(
      "http://localhost:3000/api/ia/explicar",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          pergunta,
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data.erro || "Erro ao consultar a IA."
      );
    }

    setRespostaIA(data.resposta);
  } catch (error) {
    console.error(error);
    setErroIA(
      "Não foi possível estudar este versículo com a IA."
    );
  } finally {
    setCarregandoIA(false);
  }
}

  // Capítulo anterior
  function irParaCapituloAnterior() {
    if (capituloSelecionado > 1) {
      setCapituloSelecionado(capituloSelecionado - 1);
    }
  }

  // Próximo capítulo
  function irParaProximoCapitulo() {
    if (capituloSelecionado < capitulos.length) {
      setCapituloSelecionado(capituloSelecionado + 1);
    }
  }

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
          
          <section className="bible-search" aria-labelledby="pesquisa-titulo">
            <div className="bible-search-heading">
              <span className="bible-search-icon" aria-hidden="true">
                <Search size={19} />
              </span>
              <div>
                <h2 id="pesquisa-titulo">Pesquisar na Bíblia</h2>
                <p>Encontre palavras e passagens em toda a Bíblia.</p>
              </div>
            </div>

            <form
              className="bible-search-form"
              onSubmit={(e) => {
                e.preventDefault();
                pesquisarBiblia();
              }}
            >
              <div className="bible-search-input-wrap">
                <Search size={18} aria-hidden="true" />
                <input
                  id="pesquisa-biblica"
                  type="search"
                  placeholder="Ex.: amor, fé, esperança..."
                  value={termoBusca}
                  onChange={(e) => {
                    setTermoBusca(e.target.value);
                    if (erroBusca) setErroBusca("");
                  }}
                  aria-label="Palavra ou expressão para pesquisar"
                />
              </div>

              <button type="submit" disabled={carregandoBusca}>
                {carregandoBusca ? (
                  <>
                    <LoaderCircle size={17} className="bible-search-spinner" />
                    Pesquisando
                  </>
                ) : (
                  <>
                    <Search size={17} />
                    Pesquisar
                  </>
                )}
              </button>
            </form>

            {!buscaEnviada && termoBusca.trim().length === 1 && !erroBusca && (
              <p className="bible-search-hint">Digite mais um caractere para pesquisar.</p>
            )}

            {erroBusca && (
              <p className="bible-search-message is-error" role="alert">{erroBusca}</p>
            )}

            {buscaEnviada && (
              <div className="bible-search-response" aria-live="polite">
                <div className="bible-search-response-header">
                  {carregandoBusca ? (
                    <p className="bible-search-message">Buscando “{termoPesquisado}”...</p>
                  ) : !erroBusca && (
                    <p className="bible-search-message">
                      {totalResultados > 0
                        ? `${totalResultados} ${totalResultados === 1 ? "versículo encontrado" : "versículos encontrados"} para “${termoPesquisado}”`
                        : `Nenhum resultado encontrado para “${termoPesquisado}”.`}
                    </p>
                  )}
                  <button
                    className="bible-search-cancel"
                    type="button"
                    onClick={cancelarPesquisa}
                  >
                    <X size={16} />
                    Voltar à leitura
                  </button>
                </div>

                {!carregandoBusca && resultadosBusca.length > 0 && (
                  <>
                    <div className="bible-search-results">
                      {resultadosBusca.slice(0, quantidadeExibida).map((item, index) => (
                        <article
  className="bible-search-result"
  key={`${item.abreviacao}-${item.capitulo}-${item.versiculo}-${index}`}
  role="button"
  tabIndex={0}
  onClick={() => abrirVersiculoPesquisado(item)}
  onKeyDown={(e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      abrirVersiculoPesquisado(item);
    }
  }}
  aria-label={`Abrir ${item.livro} ${item.capitulo}:${item.versiculo}`}
>
                          <strong>
                            <BookOpen size={15} />
                            {item.livro} {item.capitulo}:{item.versiculo}
                          </strong>
                          <p>{item.texto}</p>
                        </article>
                      ))}
                    </div>
                    {resultadosBusca.length > 5 && (
                      <button
                        type="button"
                        className="bible-search-more"
                        onClick={() =>
                          setQuantidadeExibida((quantidade) =>
                            quantidade >= resultadosBusca.length
                              ? 5
                              : Math.min(quantidade + 5, resultadosBusca.length)
                          )
                        }
                      >
                        {quantidadeExibida >= resultadosBusca.length
                          ? "Mostrar menos"
                          : `Ver mais resultados (${resultadosBusca.length - quantidadeExibida})`}
                      </button>
                    )}
                  </>
                )}
              </div>
            )}
          </section>

          {!buscaEnviada && (
            <>
          {/* Controles */}
          <div className="bible-controls">

            {/* Livro */}
            <div className="bible-field">
              <label>Livro</label>

              <select
                value={livroSelecionado}
                onChange={(e) => setLivroSelecionado(e.target.value)}
              >
                {livros.map((livro) => (
                  <option
                    key={livro.abreviacao}
                    value={livro.nome}
                  >
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
                  <option
                    key={capitulo}
                    value={capitulo}
                  >
                    {capitulo}
                  </option>
                ))}
              </select>
            </div>

          </div>

          {/* Navegação entre capítulos */}
          <div className="chapter-navigation">

            <button
              onClick={irParaCapituloAnterior}
              disabled={capituloSelecionado <= 1}
            >
              ← Capítulo anterior
            </button>

            <span>
              {livroSelecionado} {capituloSelecionado}
            </span>

            <button
              onClick={irParaProximoCapitulo}
              disabled={
                capituloSelecionado >= capitulos.length
              }
            >
              Próximo capítulo →
            </button>

          </div>

          {/* Conteúdo da Bíblia */}
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
  <div key={versiculo.numero} className="verse-wrapper">

    <p
      className={
        versiculoSelecionado === versiculo.numero
          ? "verse selected"
          : "verse"
      }
      onClick={() => {
  setVersiculoSelecionado(versiculo.numero);
  setRespostaIA("");
  setErroIA("");
}}
    >
      <strong>{versiculo.numero}</strong>{" "}
      {versiculo.texto}
    </p>

    {versiculoSelecionado === versiculo.numero && (
      <div className="verse-study-panel">

        <div className="verse-study-header">

          <span>
            ✨ Versículo selecionado
          </span>

          <button
            onClick={() =>
              setVersiculoSelecionado(null)
            }
          >
            ×
          </button>

        </div>

        <h3>
          {livroSelecionado} {capituloSelecionado}:
          {versiculoSelecionado}
        </h3>

        <p>
          O que você gostaria de estudar sobre este
          versículo?
        </p>

        <button
  className="study-ai-button"
  onClick={estudarVersiculo}
  disabled={carregandoIA}
>
  {carregandoIA
    ? "Consultando a IA..."
    : "✨ Estudar este versículo"}
</button>

{erroIA && (
  <div className="ai-error">
    {erroIA}
  </div>
)}

{respostaIA && (
  <div className="verse-ai-response">
    <h4>✨ Estudo do versículo</h4>

    <ReactMarkdown>
      {respostaIA}
    </ReactMarkdown>
  </div>
)}

      </div>
    )}

  </div>
))}

              </div>
            )}

          </div>
            </>
          )}

        </div>
      </main>
    </div>
  );
}

export default Bible;