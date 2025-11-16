"use client";

import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";

export function Navbar() {
  return (
    <header className="h-16 bg-white shadow flex items-center px-6 justify-between">
      <div className="flex items-center gap-3">
        <Menu className="w-6 h-6 md:hidden" /> {/* botón mobile */}
        <h1 className="text-xl font-semibold">Panel de Gestión</h1>
      </div>

      <div>
        <Button variant="outline" size="sm" onClick={() => alert("Perfil próximo!")}>
          Mi cuenta
        </Button>
      </div>
    </header>
  );
}
