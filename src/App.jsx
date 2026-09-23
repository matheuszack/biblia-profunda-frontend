import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Bible from "./pages/Bible";
import AI from "./pages/AI";
import Quiz from "./pages/Quiz";

import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        <Route path="/" element={<Home />} />

        <Route path="/biblia" element={<Bible />} />

        <Route path="/ia" element={<AI />} />

        <Route path="/quiz" element={<Quiz />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;