import { NavLink } from "react-router-dom";


import {
  Home,
  BookOpen,
  Sparkles,
  Brain,
} from "lucide-react";

function Sidebar() {
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

  <NavLink
    to="/"
    className="nav-item"
  >
    <Home size={20} />
    <span>Início</span>
  </NavLink>

  <NavLink
    to="/biblia"
    className="nav-item"
  >
    <BookOpen size={20} />
    <span>Bíblia</span>
  </NavLink>

  <NavLink
    to="/ia"
    className="nav-item"
  >
    <Sparkles size={20} />
    <span>Explicação IA</span>
  </NavLink>

  <NavLink
    to="/quiz"
    className="nav-item"
  >
    <Brain size={20} />
    <span>Quiz</span>
  </NavLink>

</nav>
    </aside>
  );
}

export default Sidebar;