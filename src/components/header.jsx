import React from "react";

export default function Header({ texto }) {
  return (
    <header className="bg-white shadow p-4 flex justify-between items-center">
      <div className="flex items-center gap-4">
        <span className="text-gray-700 font-medium">{texto}</span>
      </div>
    </header>
  );
}
