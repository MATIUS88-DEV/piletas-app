"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      // Si ya está logueado, vamos al dashboard
      router.replace("/dashboard");
    } else {
      // Si no hay token, vamos al login
      router.replace("/login");
    }
  }, [router]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <p className="text-gray-600 text-lg">Redirigiendo...</p>
    </div>
  );
}
