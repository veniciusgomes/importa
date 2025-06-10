import React from "react";
import { Link } from "react-router-dom";

export const SideBar = () => {
  return (
    <aside className="w-64 bg-white shadow-md p-4">
      <h2 className="text-xl font-bold mb-6">Menu</h2>
      <nav className="flex flex-col gap-4">
        <Link className="hover:text-blue-600" to="/">
          Início
        </Link>
        <Link className="hover:text-blue-600" to="/page2">
          page2
        </Link>
        <a href="#" className="hover:text-blue-600">
          Nova Importação
        </a>
        <a href="#" className="hover:text-blue-600">
          Lotes Anteriores
        </a>
        <a href="#" className="hover:text-blue-600">
          Configurações
        </a>
        <a href="#" className="hover:text-blue-600">
          Ajuda/Suporte
        </a>
      </nav>
    </aside>
  );
};
