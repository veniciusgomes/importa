import React from "react";
import { HashRouter as Router, Routes, Route, Link } from "react-router-dom";
import Home from "./pages/home";
import Calculadoras from "./pages/calculadoras";
import Estoque from "./pages/estoque";
import Lotes from "./pages/lotes";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/calculadoras" element={<Calculadoras />} />
        <Route path="/estoque" element={<Estoque />} />
        <Route path="/lotes" element={<Lotes />} />
      </Routes>
    </Router>
  );
}
