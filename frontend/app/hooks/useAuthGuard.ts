"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

export function useAuthGuard() {
  const router = useRouter();
  const [ready, setReady] = useState(false);
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    const token = typeof window !== "undefined"
      ? localStorage.getItem("token")
      : null;

    // 1) Si NO hay token → ir directo a login
    if (!token) {
      router.replace("/login");
      return;
    }

    // 2) Validar token contra backend
    axios
      .get(`${apiUrl}/auth/validate`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(() => {
        // Token válido → permitir renderizado
        setReady(true);
      })
      .catch(() => {
        // Token vencido o inválido → redirigir y limpiar
        localStorage.removeItem("token");
        localStorage.removeItem("tipo");
        router.replace("/login");
      });
  }, [router, apiUrl]);

  return ready;
}
