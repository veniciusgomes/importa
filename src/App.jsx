import React from "react";
import { HashRouter as Router, Routes, Route, Link } from "react-router-dom";
import Home from "./pages/home";
import Page2 from "./pages/page2";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/page2" element={<Page2 />} />
      </Routes>
    </Router>
  );
}
