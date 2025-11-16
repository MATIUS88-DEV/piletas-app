"use client";

import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useAuthGuard } from "@/app/hooks/useAuthGuard";

import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";

export default function AltaCliente() {
  const ready = useAuthGuard();
  const router = useRouter();
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  const [data, setData] = useState({
    nrsocio: "",
    dni: "",
    nombre: "",
    apellido: "",
    telefono: "",
    correo: "",
    tipo: "",
    estado: "Activo",
    aptoMedico: false
  });

  const [errores, setErrores] = useState({});

  if (!ready) return <p className="p-8 text-gray-500">Cargando...</p>;

  const validar = () => {
    let e: any = {};

    if (!/^[0-9]+$/.test(data.nrsocio)) e.nrsocio = "Debe ser numérico";
    if (!/^[0-9]+$/.test(data.dni)) e.dni = "Debe ser numérico";
    if (!/^[a-zA-ZÁÉÍÓÚáéíóúñÑ ]+$/.test(data.nombre)) e.nombre = "Sólo letras";
    if (!/^[a-zA-ZÁÉÍÓÚáéíóúñÑ ]+$/.test(data.apellido)) e.apellido = "Sólo letras";
    if (!/^[0-9]+$/.test(data.telefono)) e.telefono = "Debe ser numérico";
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(data.correo)) e.correo = "Correo inválido";
    if (!data.tipo) e.tipo = "Debe seleccionar un tipo";

    setErrores(e);
    return Object.keys(e).length === 0;
  };

  const crearSocio = async () => {
    if (!validar()) return;

    try {
      const token = localStorage.getItem("token");

      const res = await axios.post(`${apiUrl}/socios`, data, {
        headers: { Authorization: `Bearer ${token}` }
      });

      const creado = res.data;
      router.push(`/clientes/detalle/${creado.nrsocio}`);
    } catch (err) {
      console.error(err);
      alert("Error al crear socio");
    }
  };

  return (
    <main className="p-10 flex justify-center">
      <Card className="w-full max-w-3xl shadow-lg border rounded-xl">
        
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Alta de Cliente</CardTitle>
        </CardHeader>

        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            {/* CAMPOS DE TEXTO */}
            {[
              { key: "nrsocio", label: "Nro Socio", type: "text" },
              { key: "dni", label: "DNI", type: "text" },
              { key: "nombre", label: "Nombre", type: "text" },
              { key: "apellido", label: "Apellido", type: "text" },
              { key: "telefono", label: "Teléfono", type: "text" },
              { key: "correo", label: "Correo Electrónico", type: "email" }
            ].map(({ key, label, type }) => (
              <div key={key} className="flex flex-col space-y-2">
                <Label>{label}</Label>
                <Input
                  type={type}
                  value={data[key]}
                  onChange={(e) => setData({ ...data, [key]: e.target.value })}
                  className={errores[key] ? "border-red-500" : ""}
                />
                {errores[key] && <p className="text-red-500 text-sm">{errores[key]}</p>}
              </div>
            ))}

            {/* SELECT TIPO */}
            <div className="flex flex-col space-y-2">
              <Label>Tipo</Label>
              <Select onValueChange={(value) => setData({ ...data, tipo: value })}>
                <SelectTrigger className={errores.tipo ? "border-red-500" : ""}>
                  <SelectValue placeholder="Seleccionar tipo..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Pileta Libre">Pileta Libre</SelectItem>
                  <SelectItem value="Clases">Clases</SelectItem>
                </SelectContent>
              </Select>
              {errores.tipo && <p className="text-red-500 text-sm">{errores.tipo}</p>}
            </div>

            {/* SWITCH APTO MÉDICO */}
            <div className="flex flex-col space-y-2">
              <Label>Apto Médico</Label>
              <Switch
                checked={data.aptoMedico}
                onCheckedChange={(v) => setData({ ...data, aptoMedico: v })}
              />
            </div>

          </div>
        </CardContent>

        <CardFooter className="flex justify-between mt-6">
          <Button variant="secondary" onClick={() => router.push("/dashboard")}>
            Volver al menú
          </Button>

          <Button onClick={crearSocio}>
            Crear Socio
          </Button>
        </CardFooter>

      </Card>
    </main>
  );
}
