import React from "react";
import { HashRouter as Router, Routes, Route, Link } from "react-router-dom";
import Home from "./pages/home";
import NovaImportacao from "./pages/novaImportacao";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/novaImportacao" element={<NovaImportacao />} />
      </Routes>
    </Router>
  );
}
