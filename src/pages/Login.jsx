
import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { BookOpen, LogIn } from "lucide-react";
import { useAuth } from "../context/AuthContext";

function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");
  const [carregando, setCarregando] = useState(false);

  const mensagem = location.state?.mensagem;

  async function entrar(event) {
    event.preventDefault();

    setErro("");
    setCarregando(true);

    try {
      await login(email, senha);
      navigate("/", { replace: true });
    } catch (error) {
      setErro(error.message || "Não foi possível realizar o login.");
    } finally {
      setCarregando(false);
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-logo">
          <div className="auth-logo-icon">
            <BookOpen size={28} />
          </div>

          <h1>Bíblia Profunda</h1>
          <p>Entre na sua conta para continuar seus estudos.</p>
        </div>

        {mensagem && (
          <div className="auth-success" role="status">
            {mensagem}
          </div>
        )}

        <form onSubmit={entrar} className="auth-form">
          <label htmlFor="email">E-mail</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="seu@email.com"
            autoComplete="email"
            required
          />

          <label htmlFor="senha">Senha</label>
          <input
            id="senha"
            type="password"
            value={senha}
            onChange={(event) => setSenha(event.target.value)}
            placeholder="Sua senha"
            autoComplete="current-password"
            required
          />

          {erro && (
            <div className="auth-error" role="alert">
              {erro}
            </div>
          )}

          <button type="submit" disabled={carregando}>
            <LogIn size={18} />
            {carregando ? "Entrando..." : "Entrar"}
          </button>
        </form>

        <p className="auth-footer">
          Ainda não possui uma conta? <Link to="/cadastro">Cadastre-se</Link>
        </p>

        <Link to="/" className="auth-back">
          Voltar ao início
        </Link>
      </div>
    </div>
  );
}

export default Login;
