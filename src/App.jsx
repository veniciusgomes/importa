import React from "react";
import { HashRouter as Router, Routes, Route, Link } from "react-router-dom";
import Home from "./pages/home";
import CalculoTaxa from "./pages/novaImportacao";
import Estoque from "./pages/estoque";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/calculoTaxa" element={<CalculoTaxa />} />
        <Route path="/estoque" element={<Estoque />} />
      </Routes>
    </Router>
  );
}
