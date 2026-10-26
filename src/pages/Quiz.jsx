
import { useState } from "react";
import { Brain, CheckCircle2, XCircle, RotateCcw, ArrowRight } from "lucide-react";
import Sidebar from "../components/Sidebar";

const perguntas = [
  {
    pergunta: "Quem construiu a arca para sobreviver ao dilúvio?",
    alternativas: ["Abraão", "Moisés", "Noé", "Davi"],
    correta: 2,
    referencia: "Gênesis 6–7",
  },
  {
    pergunta: "Quantos dias Jesus passou no deserto sendo tentado?",
    alternativas: ["7 dias", "12 dias", "30 dias", "40 dias"],
    correta: 3,
    referencia: "Mateus 4:1–2",
  },
  {
    pergunta: "Quem derrotou o gigante Golias?",
    alternativas: ["Salomão", "Davi", "Josué", "Samuel"],
    correta: 1,
    referencia: "1 Samuel 17",
  },
  {
    pergunta: "Qual foi o primeiro livro da Bíblia?",
    alternativas: ["Êxodo", "Salmos", "Gênesis", "Mateus"],
    correta: 2,
    referencia: "Gênesis 1:1",
  },
  {
    pergunta: "Quem foi lançado na cova dos leões?",
    alternativas: ["Daniel", "Elias", "José", "Isaías"],
    correta: 0,
    referencia: "Daniel 6",
  },
  {
    pergunta: "Qual discípulo negou Jesus três vezes?",
    alternativas: ["João", "Pedro", "Tomé", "André"],
    correta: 1,
    referencia: "Lucas 22:54–62",
  },
  {
    pergunta: "Em qual cidade Jesus nasceu?",
    alternativas: ["Nazaré", "Jerusalém", "Belém", "Jericó"],
    correta: 2,
    referencia: "Mateus 2:1",
  },
  {
    pergunta: "Quem recebeu os Dez Mandamentos?",
    alternativas: ["Moisés", "Abraão", "Josué", "Arão"],
    correta: 0,
    referencia: "Êxodo 20",
  },
  {
    pergunta: "Qual era a profissão de Pedro antes de seguir Jesus?",
    alternativas: ["Carpinteiro", "Pastor de ovelhas", "Pescador", "Cobrador de impostos"],
    correta: 2,
    referencia: "Mateus 4:18–20",
  },
  {
    pergunta: "Qual é o último livro da Bíblia?",
    alternativas: ["Judas", "Hebreus", "Atos", "Apocalipse"],
    correta: 3,
    referencia: "Apocalipse",
  },
  {
    pergunta: "Quem foi engolido por um grande peixe?",
    alternativas: ["Jonas", "Jó", "Ezequiel", "Esdras"],
    correta: 0,
    referencia: "Jonas 1:17",
  },
  {
    pergunta: "Qual foi o primeiro milagre de Jesus narrado no Evangelho de João?",
    alternativas: [
      "Curar um cego",
      "Transformar água em vinho",
      "Multiplicar os pães",
      "Andar sobre as águas",
    ],
    correta: 1,
    referencia: "João 2:1–11",
  },
];

const embaralhar = (lista) =>
  [...lista].sort(() => Math.random() - 0.5);

const sortearPerguntas = () => embaralhar(perguntas).slice(0, 5);

function Quiz() {
  const [rodada, setRodada] = useState(sortearPerguntas);
  const [indice, setIndice] = useState(0);
  const [respostaSelecionada, setRespostaSelecionada] = useState(null);
  const [pontuacao, setPontuacao] = useState(0);
  const [finalizado, setFinalizado] = useState(false);

  const perguntaAtual = rodada[indice];
  const respondeu = respostaSelecionada !== null;
  const progresso = finalizado ? 100 : (indice / rodada.length) * 100;

  function responder(alternativaIndex) {
    if (respondeu) return;

    setRespostaSelecionada(alternativaIndex);

    if (alternativaIndex === perguntaAtual.correta) {
      setPontuacao((atual) => atual + 1);
    }
  }

  function proximaPergunta() {
    if (indice === rodada.length - 1) {
      setFinalizado(true);
      return;
    }

    setIndice((atual) => atual + 1);
    setRespostaSelecionada(null);
  }

  function reiniciarQuiz() {
    setRodada(sortearPerguntas());
    setIndice(0);
    setRespostaSelecionada(null);
    setPontuacao(0);
    setFinalizado(false);
  }

  const botaoBase = {
    width: "100%",
    padding: "15px 18px",
    borderRadius: "12px",
    border: "1px solid #eee5d9",
    background: "#fff",
    color: "#332d27",
    textAlign: "left",
    fontSize: "15px",
    cursor: respondeu ? "default" : "pointer",
    transition: "background 0.2s, border-color 0.2s",
  };

  return (
    <div className="app-layout">
      <Sidebar />

      <main className="page-content">
        <div className="page-header">
          <div className="page-icon">
            <Brain size={28} />
          </div>

          <div>
            <h1>Quiz Bíblico</h1>
            <p>Teste seus conhecimentos sobre as Escrituras.</p>
          </div>
        </div>

        <section className="placeholder" style={{ maxWidth: 900 }}>
          {!finalizado ? (
            <>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  gap: 16,
                  flexWrap: "wrap",
                  marginBottom: 16,
                }}
              >
                <span style={{ color: "#a45b20", fontWeight: 600 }}>
                  <Brain size={17} style={{ verticalAlign: "middle", marginRight: 6 }} />
                  Conhecimento bíblico
                </span>

                <span style={{ color: "#777", fontSize: 14 }}>
                  Pergunta {indice + 1} de {rodada.length}
                </span>
              </div>

              <div
                style={{
                  height: 7,
                  background: "#f0e9df",
                  borderRadius: 20,
                  overflow: "hidden",
                  marginBottom: 32,
                }}
              >
                <div
                  style={{
                    height: "100%",
                    width: `${progresso}%`,
                    background: "#d97732",
                    borderRadius: 20,
                    transition: "width 0.3s",
                  }}
                />
              </div>

              <h2
                style={{
                  fontSize: "clamp(22px, 3vw, 30px)",
                  lineHeight: 1.4,
                  marginBottom: 28,
                }}
              >
                {perguntaAtual.pergunta}
              </h2>

              <div style={{ display: "grid", gap: 12 }}>
                {perguntaAtual.alternativas.map((alternativa, i) => {
                  const correta = i === perguntaAtual.correta;
                  const selecionada = i === respostaSelecionada;

                  let estilo = { ...botaoBase };

                  if (respondeu && correta) {
                    estilo = {
                      ...estilo,
                      background: "#edf8ef",
                      border: "1px solid #68ad78",
                      color: "#236b35",
                    };
                  } else if (selecionada && !correta) {
                    estilo = {
                      ...estilo,
                      background: "#fff0ef",
                      border: "1px solid #d98b85",
                      color: "#a42e28",
                    };
                  } else if (respondeu) {
                    estilo = {
                      ...estilo,
                      opacity: 0.7,
                    };
                  }

                  return (
                    <button
                      key={alternativa}
                      type="button"
                      onClick={() => responder(i)}
                      disabled={respondeu}
                      style={estilo}
                    >
                      <span
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          gap: 12,
                        }}
                      >
                        <span>
                          <strong style={{ marginRight: 12 }}>
                            {String.fromCharCode(65 + i)}.
                          </strong>
                          {alternativa}
                        </span>

                        {respondeu && correta && (
                          <CheckCircle2 size={20} />
                        )}

                        {selecionada && !correta && (
                          <XCircle size={20} />
                        )}
                      </span>
                    </button>
                  );
                })}
              </div>

              {respondeu && (
                <div
                  role="status"
                  style={{
                    marginTop: 24,
                    padding: 18,
                    borderRadius: 12,
                    background:
                      respostaSelecionada === perguntaAtual.correta
                        ? "#edf8ef"
                        : "#fff5e9",
                    color:
                      respostaSelecionada === perguntaAtual.correta
                        ? "#236b35"
                        : "#87501c",
                  }}
                >
                  <strong>
                    {respostaSelecionada === perguntaAtual.correta
                      ? "Muito bem! Você acertou."
                      : `Não foi dessa vez. A resposta correta é: ${perguntaAtual.alternativas[perguntaAtual.correta]}.`}
                  </strong>

                  <p style={{ margin: "8px 0 0", fontSize: 14 }}>
                    Referência para estudo: {perguntaAtual.referencia}
                  </p>
                </div>
              )}

              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  gap: 16,
                  flexWrap: "wrap",
                  marginTop: 28,
                }}
              >
                <span style={{ color: "#777", fontSize: 14 }}>
                  Pontuação: {pontuacao} {pontuacao === 1 ? "acerto" : "acertos"}
                </span>

                <button
                  type="button"
                  onClick={proximaPergunta}
                  disabled={!respondeu}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 9,
                    padding: "13px 20px",
                    border: "none",
                    borderRadius: 12,
                    background: respondeu ? "#d97732" : "#e8dfd4",
                    color: respondeu ? "#fff" : "#8c8175",
                    fontWeight: 600,
                    cursor: respondeu ? "pointer" : "not-allowed",
                  }}
                >
                  {indice === rodada.length - 1
                    ? "Ver resultado"
                    : "Próxima pergunta"}
                  <ArrowRight size={18} />
                </button>
              </div>
            </>
          ) : (
            <div style={{ textAlign: "center", padding: "20px 0" }}>
              <div
                style={{
                  width: 76,
                  height: 76,
                  borderRadius: "50%",
                  background: "#fff0df",
                  color: "#bd6726",
                  display: "grid",
                  placeItems: "center",
                  margin: "0 auto 22px",
                }}
              >
                <Brain size={38} />
              </div>

              <h2 style={{ fontSize: 30, marginBottom: 10 }}>
                Rodada concluída!
              </h2>

              <p style={{ color: "#6e665e", fontSize: 16 }}>
                Você acertou {pontuacao} de {rodada.length} perguntas.
              </p>

              <div
                style={{
                  fontSize: 44,
                  fontWeight: 700,
                  color: "#bd6726",
                  margin: "24px 0",
                }}
              >
                {Math.round((pontuacao / rodada.length) * 100)}%
              </div>

              <p style={{ color: "#6e665e", marginBottom: 28 }}>
                {pontuacao === 5
                  ? "Excelente! Você acertou todas as perguntas."
                  : pontuacao >= 3
                    ? "Muito bem! Continue estudando para aprender ainda mais."
                    : "Cada rodada é uma oportunidade de aprender. Tente novamente!"}
              </p>

              <button
                type="button"
                onClick={reiniciarQuiz}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 10,
                  padding: "14px 22px",
                  border: "none",
                  borderRadius: 12,
                  background: "#d97732",
                  color: "#fff",
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                <RotateCcw size={18} />
                Jogar novamente
              </button>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

export default Quiz;
