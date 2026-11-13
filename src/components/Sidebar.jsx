
import { NavLink, useNavigate } from "react-router-dom";

import {
  Home,
  BookOpen,
  Sparkles,
  Brain,
  LogIn,
  LogOut,
  UserPlus,
  User,
} from "lucide-react";

import { useAuth } from "../context/AuthContext";

function Sidebar() {
  const { usuario, logout } = useAuth();
  const navigate = useNavigate();

  function sair() {
    logout();
    navigate("/login");
  }

  return (
    <aside className="sidebar">
      <div className="logo">
        <div className="logo-icon">
          <BookOpen size={24} />
        </div>

        <div className="logo-text">
          <strong>Bíblia</strong>
          <span>Profunda</span>
        </div>
      </div>

      <nav className="sidebar-nav">
        <NavLink to="/" className="nav-item">
          <Home size={20} />
          <span>Início</span>
        </NavLink>

        <NavLink to="/biblia" className="nav-item">
          <BookOpen size={20} />
          <span>Bíblia</span>
        </NavLink>

        <NavLink to="/ia" className="nav-item">
          <Sparkles size={20} />
          <span>Explicação IA</span>
        </NavLink>

        <NavLink to="/quiz" className="nav-item">
          <Brain size={20} />
          <span>Quiz</span>
        </NavLink>
      </nav>

      <div className="sidebar-auth">
        {usuario ? (
          <>
            <div className="nav-item">
              <User size={20} />
              <span>{usuario.nome}</span>
            </div>

            <button className="nav-item sidebar-logout" onClick={sair}>
              <LogOut size={20} />
              <span>Sair</span>
            </button>
          </>
        ) : (
          <>
            <NavLink to="/login" className="nav-item">
              <LogIn size={20} />
              <span>Entrar</span>
            </NavLink>

            <NavLink to="/cadastro" className="nav-item">
              <UserPlus size={20} />
              <span>Criar conta</span>
            </NavLink>
          </>
        )}
      </div>
    </aside>
  );
}

export default Sidebar;
