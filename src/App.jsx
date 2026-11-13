
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Bible from "./pages/Bible";
import AI from "./pages/AI";
import Quiz from "./pages/Quiz";
import Login from "./pages/Login";
import Register from "./pages/Register";

import { AuthProvider } from "./context/AuthContext";

import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/biblia" element={<Bible />} />
          <Route path="/ia" element={<AI />} />
          <Route path="/quiz" element={<Quiz />} />
          <Route path="/login" element={<Login />} />
          <Route path="/cadastro" element={<Register />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
