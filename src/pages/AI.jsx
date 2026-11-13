
import { useState } from "react";
import { Link } from "react-router-dom";
import { Sparkles } from "lucide-react";
import ReactMarkdown from "react-markdown";
import Sidebar from "../components/Sidebar";
import { useAuth } from "../context/AuthContext";

function AI() {
  const { usuario, token } = useAuth();

  const [pergunta, setPergunta] = useState("");
  const [resposta, setResposta] = useState("");
  const [consumo, setConsumo] = useState(null);
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState("");

  async function perguntarIA() {
    if (!pergunta.trim() || !token) return;

    setCarregando(true);
    setResposta("");
    setConsumo(null);
    setErro("");

    try {
      const response = await fetch(
        "http://localhost:3000/api/ia/explicar",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ pergunta }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.erro || "Erro ao consultar a IA.");
      }

      setResposta(data.resposta);
      setConsumo(data.consumo || null);
    } catch (error) {
      console.error(error);
      setErro(error.message || "Não foi possível consultar a IA.");
    } finally {
      setCarregando(false);
    }
  }

  return (
    <div className="app-layout">
      <Sidebar />

      <main className="page-content">
        <div className="page-header">
          <div className="page-icon">
            <Sparkles size={28} />
          </div>

          <div>
            <h1>Explicação com IA</h1>
            <p>
              Faça uma pergunta sobre a Bíblia e aprofunde seus estudos.
            </p>
          </div>
        </div>

        {!token ? (
          <div className="ai-auth-required">
            <h2>Entre na sua conta</h2>
            <p>
              Para utilizar o assistente de inteligência artificial,
              você precisa estar conectado.
            </p>

            <Link to="/login">Fazer login</Link>
          </div>
        ) : (
          <div className="ai-container">
            <p>
              Olá, <strong>{usuario?.nome}</strong>! O que deseja estudar hoje?
            </p>

            <label htmlFor="ai-question">Sua pergunta</label>

            <textarea
              id="ai-question"
              value={pergunta}
              onChange={(event) => setPergunta(event.target.value)}
              placeholder="Ex: Por que Jesus ensinou a amar os inimigos?"
              rows={6}
            />

            <button
              onClick={perguntarIA}
              disabled={carregando || !pergunta.trim()}
            >
              <Sparkles size={18} />
              {carregando ? "Consultando..." : "Perguntar à IA"}
            </button>

            {erro && (
              <div className="ai-error" role="alert">
                {erro}
              </div>
            )}

            {consumo && (
              <div className="ai-usage">
                Consultas utilizadas hoje:{" "}
                <strong>
                  {consumo.consultasUtilizadas} de {consumo.limiteDiario}
                </strong>

                <p>
                  Consultas restantes:{" "}
                  <strong>{consumo.consultasRestantes}</strong>
                </p>
              </div>
            )}

            {resposta && (
              <div className="ai-response">
                <h2>Resposta</h2>
                <ReactMarkdown>{resposta}</ReactMarkdown>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}

export default AI;
