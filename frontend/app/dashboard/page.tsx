"use client";

import { useRouter } from "next/navigation";
import { useAuthGuard } from "@/app/hooks/useAuthGuard";

// shadcn/ui
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default function Dashboard() {
  const router = useRouter();
  const ready = useAuthGuard();

  if (!ready) return <p className="p-8 text-gray-500">Cargando...</p>;

  const cards = [
    { title: "Buscar Cliente", description: "Buscar un cliente existente", path: "/clientes/buscar" },
    { title: "Alta Cliente", description: "Dar de alta un nuevo cliente", path: "/clientes/nuevo" },
    { title: "Listado General", description: "Ver todos los clientes", path: "/clientes/listado" },
  ];

  return (
    <main className="min-h-screen p-8 bg-gray-100">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {cards.map((card) => (
          <Card
            key={card.title}
            className="cursor-pointer hover:shadow-xl transition"
            onClick={() => router.push(card.path)}
          >
            <CardHeader>
              <CardTitle>{card.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-500">{card.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </main>
  );
}
