import React from "react";
import { createRoot } from "react-dom/client";
import { HashRouter as Router, Routes, Route, Link } from "react-router-dom";
import Home from "./pages/home";
import Page1 from "./pages/page1";
import Logo from "./images/logo.png";

const App = () => {
  return (
    <Router>
      <nav
        style={{
          display: "flex",
          gap: "1rem",
          alignItems: "center",
          background: "#faebd7",
        }}
      >
        <img src={Logo} alt="Logo" style={{ width: 60, height: 60 }} />

        <Link to="/">Home</Link>
        <Link to="/page1">page1</Link>
      </nav>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/page1" element={<Page1 />} />
      </Routes>
    </Router>
  );
};

const container = document.getElementById("root");
const root = createRoot(container);
root.render(<App />);
