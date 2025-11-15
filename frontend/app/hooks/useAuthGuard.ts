"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export function useAuthGuard() {
  const router = useRouter();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const token = typeof window !== "undefined" 
      ? localStorage.getItem("token")
      : null;

    if (!token) {
      router.replace("/login");
      return;
    }

    // Token existe → dejamos renderizar
    setReady(true);
  }, [router]);

  return ready; // la página solo se renderiza cuando está listo
}
