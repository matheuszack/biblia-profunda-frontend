import { Brain } from "lucide-react";
import Sidebar from "../components/Sidebar";

function Quiz() {
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
          <p>
            Teste seus conhecimentos sobre as Escrituras.
          </p>
          </div>
        </div>

        <div className="placeholder">
          <h2>Quiz</h2>
          <p>Nosso sistema de perguntas será construído aqui.</p>
        </div>
      </main>
    </div>
  );
}

export default Quiz;