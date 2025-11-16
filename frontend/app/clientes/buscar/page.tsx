"use client";

import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useAuthGuard } from "@/app/hooks/useAuthGuard";

export default function BuscarCliente() {
  const router = useRouter();
  const ready = useAuthGuard();

  const [filtro, setFiltro] = useState({
    nrsocio: "",
    nombre: "",
    apellido: "",
    dni: ""
  });

  const [resultados, setResultados] = useState([]);
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  if (!ready) {
    return (
      <main className="p-8">
        <p className="text-gray-600">Cargando...</p>
      </main>
    );
  }

  const buscar = async () => {
    try {
      const token = localStorage.getItem("token");
      const params = Object.fromEntries(
        Object.entries(filtro).filter(([_, v]) => v)
      );

      const res = await axios.get(`${apiUrl}/socios`, {
        params,
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = res.data;
      setResultados(data);

      // 👉 Navegación automática si hay un único resultado
      if (data.length === 1) {
        const socio = data[0];
        router.push(`/clientes/detalle/${socio.nrsocio}`);
      }

    } catch (err) {
      console.error("Error al buscar:", err);
      alert("Error al buscar clientes");
    }
  };

  return (
    <main className="p-8 space-y-6">
      <h1 className="text-2xl font-bold">Buscar Cliente</h1>

      <div className="space-y-2 mb-4">
        {["nrsocio", "nombre", "apellido", "dni"].map((campo) => (
          <input
            key={campo}
            type="text"
            placeholder={campo}
            value={filtro[campo]}
            onChange={(e) =>
              setFiltro({ ...filtro, [campo]: e.target.value })
            }
            className="border p-2 rounded w-full"
          />
        ))}
      </div>

      <button
        onClick={buscar}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Buscar
      </button>

      <ul className="mt-4 space-y-2">
        {resultados.length > 1 &&
          resultados.map((s) => (
            <li
              key={s.nrsocio}
              onClick={() => router.push(`/clientes/detalle/${s.nrsocio}`)}  
              className="p-2 bg-white rounded shadow cursor-pointer hover:bg-gray-50 transition"
            >
              {s.apellido}, {s.nombre} — {s.estado}
            </li>
          ))}

        {resultados.length === 0 && (
          <p className="text-gray-500">No hay resultados.</p>
        )}
      </ul>

      <button
        onClick={() => router.push("/dashboard")}
        className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
      >
        Volver al menú
      </button>
    </main>
  );
}
