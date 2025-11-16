import "./globals.css";
import { Sidebar } from "@/components/layout/sidebar";
import { Navbar } from "@/components/layout/navbar";

export const metadata = {
  title: "Piletas App",
  description: "Gestión de socios",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className="min-h-screen flex bg-gray-100">
        {/* Sidebar */}
        <Sidebar />

        {/* Contenedor principal */}
        <div className="flex flex-col flex-1">
          {/* Navbar */}
          <Navbar />

          {/* Contenido de la página */}
          <main className="p-6">{children}</main>
        </div>
      </body>
    </html>
  );
}
