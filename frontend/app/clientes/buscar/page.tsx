"use client";

import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useAuthGuard } from "@/app/hooks/useAuthGuard";

// shadcn/ui
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

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
    return <p className="p-8 text-gray-500">Cargando...</p>;
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

      setResultados(res.data);
    } catch (err) {
      alert("Error al buscar clientes");
      console.error(err);
    }
  };

  return (
    <main className="p-8 space-y-6 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold">Buscar Cliente</h1>

      <Card className="p-6 max-w-lg">
        <CardHeader>
          <CardTitle>Filtros de Búsqueda</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {["nrsocio", "nombre", "apellido", "dni"].map((campo) => (
            <Input
              key={campo}
              placeholder={campo}
              value={filtro[campo]}
              onChange={(e) =>
                setFiltro({ ...filtro, [campo]: e.target.value })
              }
            />
          ))}

          <Button onClick={buscar} className="w-full">
            Buscar
          </Button>
        </CardContent>
      </Card>

      <Card className="p-6 max-w-xl">
        <CardHeader>
          <CardTitle>Resultados</CardTitle>
        </CardHeader>
        <CardContent>
          {resultados.length === 0 ? (
            <p className="text-gray-500">No hay resultados aún.</p>
          ) : (
            <ul className="space-y-2">
              {resultados.map((s) => (
                <li key={s.nrsocio} className="p-3 bg-white rounded shadow">
                  {s.apellido}, {s.nombre} — {s.estado}
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>

      <Button variant="secondary" onClick={() => router.push("/dashboard")}>
        Volver al menú
      </Button>
    </main>
  );
}
