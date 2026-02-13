import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from 'sonner'; // Importamos el componente de notificaciones

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "BCV Monitor | Jferrer",
  description: "Consulta la tasa oficial del BCV en tiempo real",
  // Metadatos extras para que se vea bien al compartir
  keywords: ["BCV", "Dolar", "Euro", "Venezuela", "Tasa Oficial"],
  authors: [{ name: "Jferrer" }],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es"> {/* Cambiado a 'es' para español */}
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
        
        {/* Configuración del Toaster:
            - position: Arriba al centro para que sea visible
            - richColors: Para que el verde (éxito) y rojo (error) sean vibrantes
            - theme: dark para combinar con tu fondo oscuro
        */}
        <Toaster 
          position="top-center" 
          richColors 
          theme="dark" 
          expand={false}
          closeButton
        />
      </body>
    </html>
  );
}