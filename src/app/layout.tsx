import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Lora } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/header";
import { Sidebar } from "@/components/layout/sidebar";
import { auth } from "@/lib/auth";
import { RecipeService } from "@/server/services/recipe.service";

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

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();
  const userId = session?.user?.id;

  const stats = userId
    ? await RecipeService.getUserStats(userId)
    : { myRecipesCount: 0, favoritesCount: 0 };

  return (
    <html lang="es">
      <body
        className={`${fontSans.variable} ${fontSerif.variable} font-sans antialiased min-h-screen flex flex-col bg-[#FAF8F5] text-[#23211E]`}
      >
        <Header />
        <div className="flex-1 flex flex-col lg:flex-row">
          <Sidebar
            isAuthenticated={!!userId}
            myRecipesCount={stats.myRecipesCount}
            favoritesCount={stats.favoritesCount}
          />
          <main className="flex-1 min-w-0">{children}</main>
        </div>
      </body>
    </html>
  );
}