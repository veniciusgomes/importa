import React from "react";
import { SideBar } from "../components/sidebar";
import Header from "../components/header";
import { Bar, Pie, Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement
);

export default function Home() {
  const barData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    datasets: [
      {
        label: "Valor Total (R$)",
        data: [12000, 15000, 11000, 18000, 20000, 17000],
        backgroundColor: "rgba(59, 130, 246, 0.6)",
      },
    ],
  };

  const pieData = {
    labels: ["Lucro", "Custo", "Taxas"],
    datasets: [
      {
        data: [30000, 45000, 15000],
        backgroundColor: ["#10b981", "#f59e0b", "#ef4444"],
      },
    ],
  };

  const lineData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    datasets: [
      {
        label: "Lucro Mensal (R$)",
        data: [4000, 5000, 3000, 7000, 9000, 6500],
        borderColor: "rgba(34, 197, 94, 1)",
        backgroundColor: "rgba(34, 197, 94, 0.2)",
        fill: true,
      },
    ],
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <SideBar />

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <main className="p-6 space-y-6 overflow-y-auto">
          <h2 className="text-2xl font-bold">Dashboard</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white p-4 rounded shadow">
              <h3 className="font-semibold text-lg mb-2">Total de Lotes</h3>
              <p className="text-3xl font-bold text-blue-500">45</p>
            </div>
            <div className="bg-white p-4 rounded shadow">
              <h3 className="font-semibold text-lg mb-2">
                Valor Médio por Lote
              </h3>
              <p className="text-3xl font-bold text-green-500">R$ 3.600</p>
            </div>
            <div className="bg-white p-4 rounded shadow">
              <h3 className="font-semibold text-lg mb-2">Lucro Médio</h3>
              <p className="text-3xl font-bold text-emerald-500">R$ 2.300</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-white p-4 rounded shadow">
              <h3 className="text-lg font-bold mb-4">
                Total de Valores Gastos por Mês
              </h3>
              <Bar data={barData} />
            </div>
            <div className="bg-white p-4 rounded shadow">
              <h3 className="text-lg font-bold mb-4">
                Distribuição Financeira
              </h3>
              <Pie data={pieData} />
            </div>
          </div>

          <div className="bg-white p-4 rounded shadow">
            <h3 className="text-lg font-bold mb-4">Lucro por Mês</h3>
            <Line data={lineData} />
          </div>
        </main>
      </div>
    </div>
  );
}
