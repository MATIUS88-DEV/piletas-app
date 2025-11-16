"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Home, Users, UserPlus, List } from "lucide-react";

export function Sidebar() {
  const [open, setOpen] = useState(true);
  const router = useRouter();

  const items = [
    { label: "Dashboard", icon: <Home className="w-5 h-5" />, path: "/dashboard" },
    { label: "Listado", icon: <List className="w-5 h-5" />, path: "/clientes/listado" },
  ];

  return (
    <aside
      className={`bg-white shadow h-screen transition-all ${
        open ? "w-64" : "w-20"
      } hidden md:flex flex-col`}
    >
      {/* Logo */}
      <div className="h-16 flex items-center justify-center border-b">
        <h2 className="text-lg font-bold">{open ? "Mi Club" : "MC"}</h2>
      </div>

      {/* Menu */}
      <nav className="flex-1 p-4 space-y-2">
        {items.map((item) => (
          <button
            key={item.label}
            onClick={() => router.push(item.path)}
            className="flex items-center gap-3 p-3 w-full rounded-lg hover:bg-gray-100 transition"
          >
            {item.icon}
            {open && <span>{item.label}</span>}
          </button>
        ))}
      </nav>

      {/* Botón para colapsar */}
      <div className="p-4 border-t">
        <button
          onClick={() => setOpen(!open)}
          className="w-full text-gray-600 text-sm hover:text-black"
        >
          {open ? "Colapsar" : "Expandir"}
        </button>
      </div>
    </aside>
  );
}
