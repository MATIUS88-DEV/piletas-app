"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useAuthGuard } from "@/app/hooks/useAuthGuard";

// shadcn/ui
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function ListadoSocios() {
  const router = useRouter();
  const ready = useAuthGuard();

  const [socios, setSocios] = useState([]);
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    if (!ready) return;

    const token = localStorage.getItem("token");

    axios
      .get(`${apiUrl}/socios`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then((res) => setSocios(res.data))
      .catch((err) => console.error("Error al cargar socios:", err));
  }, [ready, apiUrl]);

  if (!ready) return <p className="p-8 text-gray-500">Cargando...</p>;

  return (
    <main className="p-8 space-y-6 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold">Listado de Socios</h1>

      <Card className="p-6 max-w-xl">
        <CardHeader>
          <CardTitle>Socios Registrados</CardTitle>
        </CardHeader>

        <CardContent>
          {socios.length === 0 ? (
            <p className="text-gray-500">No hay socios cargados.</p>
          ) : (
            <ul className="space-y-2">
              {socios.map((s) => (
                <li
                  key={s.nrsocio}
                  className="p-3 bg-white rounded shadow"
                >
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
