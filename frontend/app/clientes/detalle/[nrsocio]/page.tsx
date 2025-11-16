"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";

import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

export default function DetalleSocio() {
  const { nrsocio } = useParams();
  const router = useRouter();
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  const [loading, setLoading] = useState(true);
  const [edit, setEdit] = useState(false);
  const [socio, setSocio] = useState<any>(null);

  useEffect(() => {
    if (!nrsocio || nrsocio === "undefined") return;

    const token = localStorage.getItem("token");

    axios
      .get(`${apiUrl}/socios?nrsocio=${nrsocio}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setSocio(res.data[0]);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error cargando socio:", err);
        setLoading(false);
      });
  }, [nrsocio]);

  if (!nrsocio || nrsocio === "undefined") {
    return (
      <main className="p-10">
        <p className="text-red-500 text-lg font-semibold">
          Error: el número de socio no es válido.
        </p>

        <Button className="mt-4" onClick={() => router.push("/clientes/listado")}>
          Volver
        </Button>
      </main>
    );
  }

  if (loading) return <p className="p-6">Cargando datos del socio...</p>;
  if (!socio) return <p className="p-6">Socio no encontrado.</p>;

  const actualizar = async () => {
    const token = localStorage.getItem("token");

    const payload = {
      nombre: socio.nombre,
      apellido: socio.apellido,
      dni: socio.dni,
      telefono: socio.telefono,
      correo: socio.correo,
      aptoMedico: socio.aptoMedico,
      tipo: socio.tipo, // ← agregado
    };

    try {
      await axios.put(`${apiUrl}/socios/${nrsocio}`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      alert("Socio actualizado correctamente");
      setEdit(false);
    } catch (error) {
      alert("Error al actualizar");
      console.error(error);
    }
  };

  const Campo = (label: string, key: string, type = "text") => (
    <div className="flex flex-col space-y-2">
      <Label>{label}</Label>
      <Input
        disabled={!edit}
        type={type}
        value={socio[key] ?? ""}
        onChange={(e) => setSocio({ ...socio, [key]: e.target.value })}
      />
    </div>
  );

  return (
    <main className="p-10 flex justify-center">
      <Card className="w-full max-w-3xl shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">
            Socio #{socio.nrsocio}
          </CardTitle>
        </CardHeader>

        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {Campo("Nombre", "nombre")}
          {Campo("Apellido", "apellido")}
          {Campo("DNI", "dni")}
          {Campo("Correo", "correo")}
          {Campo("Teléfono", "telefono")}

          {/* Tipo de Socio */}
          <div className="flex flex-col space-y-2">
            <Label>Tipo</Label>
            <Select
              disabled={!edit}
              value={socio.tipo ?? ""}
              onValueChange={(v) => setSocio({ ...socio, tipo: v })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar tipo..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Pileta Libre">Pileta Libre</SelectItem>
                <SelectItem value="Clases">Clases</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Apto Médico */}
          <div className="flex flex-col space-y-2">
            <Label>Apto Médico</Label>
            <Switch
              disabled={!edit}
              checked={socio.aptoMedico}
              onCheckedChange={(v) =>
                setSocio({ ...socio, aptoMedico: v })
              }
            />
          </div>
        </CardContent>

        <CardFooter className="flex justify-between mt-4">
          <Button variant="secondary" onClick={() => router.push("/clientes/listado")}>
            Volver al listado
          </Button>

          {!edit ? (
            <Button onClick={() => setEdit(true)}>Modificar</Button>
          ) : (
            <Button onClick={actualizar}>Guardar cambios</Button>
          )}
        </CardFooter>
      </Card>
    </main>
  );
}
