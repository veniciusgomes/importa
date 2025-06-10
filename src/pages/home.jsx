import React from "react";
import { SideBar } from "../components/sidebar";

export default function Home() {
  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <SideBar></SideBar>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-white shadow p-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <span className="text-gray-700 font-medium">Olá, Usuário</span>
            <select className="border rounded px-2 py-1">
              <option>PT</option>
              <option>EN</option>
            </select>
          </div>
        </header>

        {/* Central Content */}
        <main className="p-6 space-y-6 overflow-y-auto">
          {/* Estatísticas rápidas */}
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-white p-4 rounded shadow">
              Importações do mês: <strong>12</strong>
            </div>
            <div className="bg-white p-4 rounded shadow">
              Valor médio: <strong>R$ 4.500</strong>
            </div>
            <div className="bg-white p-4 rounded shadow">
              Taxas médias: <strong>28%</strong>
            </div>
          </div>

          {/* Acesso rápido */}
          <div>
            <button className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700">
              Nova Importação
            </button>
          </div>
        </main>
      </div>
    </div>
  );
}
