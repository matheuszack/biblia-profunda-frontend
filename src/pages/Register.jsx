
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { BookOpen, UserPlus } from "lucide-react";

function Register() {
  const navigate = useNavigate();

  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");
  const [carregando, setCarregando] = useState(false);

  async function cadastrar(event) {
    event.preventDefault();

    setErro("");

    if (senha.length < 8) {
      setErro("A senha precisa ter pelo menos 8 caracteres.");
      return;
    }

    setCarregando(true);

    try {
      const response = await fetch(
        "http://localhost:3000/api/auth/cadastro",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            nome,
            email,
            senha,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.erro || "Não foi possível realizar o cadastro.");
      }

      navigate("/login", {
        state: {
          mensagem: "Cadastro realizado! Agora entre com sua conta.",
        },
      });
    } catch (error) {
      setErro(error.message || "Erro ao conectar com o servidor.");
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
          <p>Crie sua conta e aprofunde seus estudos.</p>
        </div>

        <form onSubmit={cadastrar} className="auth-form">
          <label htmlFor="nome">Nome</label>
          <input
            id="nome"
            type="text"
            value={nome}
            onChange={(event) => setNome(event.target.value)}
            placeholder="Seu nome"
            maxLength={100}
            autoComplete="name"
            required
          />

          <label htmlFor="email">E-mail</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="seu@email.com"
            maxLength={255}
            autoComplete="email"
            required
          />

          <label htmlFor="senha">Senha</label>
          <input
            id="senha"
            type="password"
            value={senha}
            onChange={(event) => setSenha(event.target.value)}
            placeholder="Mínimo de 8 caracteres"
            minLength={8}
            maxLength={72}
            autoComplete="new-password"
            required
          />

          {erro && (
            <div className="auth-error" role="alert">
              {erro}
            </div>
          )}

          <button type="submit" disabled={carregando}>
            <UserPlus size={18} />
            {carregando ? "Criando conta..." : "Criar minha conta"}
          </button>
        </form>

        <p className="auth-footer">
          Já possui uma conta? <Link to="/login">Entrar</Link>
        </p>

        <Link to="/" className="auth-back">
          Voltar ao início
        </Link>
      </div>
    </div>
  );
}

export default Register;
