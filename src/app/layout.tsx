import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Lora } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/header";

const fontSans = Plus_Jakarta_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
});

const fontSerif = Lora({
  variable: "--font-serif",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Recuina — Recetario Tradicional",
  description: "Plataforma web colaborativa y recetario digital personal",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body
        className={`${fontSans.variable} ${fontSerif.variable} font-sans antialiased min-h-screen flex flex-col bg-[#FAF8F5] text-[#23211E]`}
      >
        <Header />
        <div className="flex-1 flex">
          <main className="flex-1 min-w-0">{children}</main>
        </div>
      </body>
    </html>
  );
}