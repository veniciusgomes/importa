import React, { useState } from "react";
import { SideBar } from "../components/sidebar";
import Header from "../components/header";

export default function Lotes() {
  return (
    <div className="flex h-screen bg-gray-100">
      <SideBar />
      <div className="flex-1 flex flex-col">
        <Header texto={"Lotes"} />
        <main className="p-6 space-y-6 overflow-y-auto">
          <section className="bg-white p-6 rounded shadow-md">
            <h3 className="text-xl font-bold mb-4">Tela de Lotes</h3>
            {/* Conteúdo da tela de lotes */}
          </section>
        </main>
      </div>
    </div>
  );
}
