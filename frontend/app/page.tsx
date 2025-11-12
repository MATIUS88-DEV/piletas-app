"use client";

import { useEffect, useState } from "react";
import axios from "axios";

interface Socio {
  nrsocio: string;
  nombre: string;
  apellido: string;
  dni: string;
  tipo?: string;
  estado?: string;
}

export default function HomePage() {
  const [socios, setSocios] = useState<Socio[]>([]);
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    if (!apiUrl) {
      console.error("❌ Falta configurar NEXT_PUBLIC_API_URL en .env.local");
      return;
    }

    axios
      .get(`${apiUrl}/socios`)
      .then((res) => setSocios(res.data))
      .catch((err) => console.error("Error al obtener socios:", err));
  }, [apiUrl]);

  return (
    <main style={{ padding: 20 }}>
      <h1>Socios</h1>
      {socios.length === 0 ? (
        <p>No hay socios cargados.</p>
      ) : (
        <ul>
          {socios.map((s) => (
            <li key={s.nrsocio}>
              {s.apellido}, {s.nombre} — {s.estado}
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
