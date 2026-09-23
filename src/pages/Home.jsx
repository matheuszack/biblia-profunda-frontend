import { BookOpen, Sparkles, Brain } from "lucide-react";

import Sidebar from "../components/Sidebar";
import FeatureCard from "../components/FeatureCard";

function Home() {
  return (
    <div className="app-layout">
      <Sidebar />

      <main className="main-content">

        <section className="hero">
          <div className="hero-icon">
            <BookOpen size={32} />
          </div>

          <h1>Bíblia Profunda AI</h1>

          <p>
            Estude as Escrituras com ferramentas
            inteligentes.
          </p>

          <span className="verse">
            "Lâmpada para os meus pés é tua palavra
            e luz, para o meu caminho."
          </span>
        </section>

        <section className="features">

          <FeatureCard
            icon={<BookOpen size={28} />}
            title="Leitura Bíblica"
            description="Acesse as Escrituras e mergulhe profundamente no texto bíblico."
            action="Começar a ler"
            to="/biblia"
          />

          <FeatureCard
            icon={<Sparkles size={28} />}
            title="Assistente de IA"
            description="Tire dúvidas, explore contextos históricos e compreenda melhor as Escrituras."
            action="Falar com a IA"
            to="/ia"
          />

          <FeatureCard
            icon={<Brain size={28} />}
            title="Quiz Bíblico"
            description="Teste seus conhecimentos com perguntas e desafios sobre a Bíblia."
            action="Desafiar-me"
            to="/quiz"
          />

        </section>

      </main>
    </div>
  );
}

export default Home;