import "./globals.css";

export const metadata = {
  title: "Piletas App",
  description: "Gestión de socios",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body className="bg-gray-100 min-h-screen">
        {children}
      </body>
    </html>
  );
}
