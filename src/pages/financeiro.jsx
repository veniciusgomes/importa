import React, { useState } from "react";
import { SideBar } from "../components/sidebar";
import Header from "../components/header";

export default function Financeiro() {
  return (
    <div className="flex h-screen bg-gray-100">
      <SideBar />
      <div className="flex-1 flex flex-col">
        <Header texto={"Financeiro"} />
        <main className="p-6 space-y-6 overflow-y-auto">
          <section className="bg-white p-6 rounded shadow-md">
            <h3 className="text-2xl font-bold mb-4">Financeiro</h3>
            <p className="text-gray-600">
              Esta página está em desenvolvimento. Em breve, você poderá
              gerenciar suas finanças aqui.
            </p>
          </section>
        </main>
      </div>
    </div>
  );
}
