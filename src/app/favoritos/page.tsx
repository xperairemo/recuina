import Link from "next/link";
import { redirect } from "next/navigation";
import { Bookmark, Compass } from "lucide-react";
import { auth } from "@/lib/auth";
import { RecipeService } from "@/server/services/recipe.service";
import { RecipeCard } from "@/components/recipes/RecipeCard";

export default async function FavoritosPage() {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) {
    redirect("/");
  }

  const favoriteRecipes = await RecipeService.getFavoriteRecipesByUserId(userId);

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-8">
      {/* Cabecera distintiva de Favoritos (Acento Terracotta cálido) */}
      <header className="rounded-3xl bg-[#FDF6F3] border border-[#C86D51]/25 p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/90 border border-[#C86D51]/25 text-[#B25C42] text-xs font-semibold tracking-wide uppercase">
            <Bookmark className="w-3.5 h-3.5 text-[#C86D51] fill-[#C86D51]/20" />
            <span>Colección Guardada</span>
          </div>

          <h1 className="font-serif text-3xl sm:text-4xl text-[#23211E] tracking-tight">
            Mis recetas favoritas
          </h1>

          <p className="text-sm sm:text-base text-[#6B665F] max-w-2xl">
            Tu selección personal de platos que quieres volver a preparar o tener siempre localizados.
          </p>
        </div>

        <div className="shrink-0">
          <span className="inline-flex items-center gap-1.5 text-xs font-medium text-[#B25C42] bg-white/90 px-3.5 py-2 rounded-xl border border-[#C86D51]/25">
            <Bookmark className="w-3.5 h-3.5 fill-current" />
            {favoriteRecipes.length}{" "}
            {favoriteRecipes.length === 1 ? "receta guardada" : "recetas guardadas"}
          </span>
        </div>
      </header>

      {/* Cuadrícula de favoritos o Estado Vacío */}
      {favoriteRecipes.length > 0 ? (
        <section aria-label="Recetas favoritas">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {favoriteRecipes.map((recipe) => (
              <RecipeCard
                key={recipe.id}
                recipe={recipe}
                isFavorite={true}
                isAuthenticated={true}
              />
            ))}
          </div>
        </section>
      ) : (
        <section className="w-full rounded-2xl border-2 border-dashed border-[#C86D51]/30 bg-[#FDF6F3]/40 p-10 sm:p-16 text-center space-y-5">
          <div className="w-16 h-16 mx-auto rounded-full bg-[#C86D51]/15 text-[#C86D51] flex items-center justify-center">
            <Bookmark className="w-7 h-7" />
          </div>

          <div className="space-y-2 max-w-md mx-auto">
            <h2 className="font-serif text-2xl text-[#23211E] font-medium">
              Aún no tienes recetas guardadas
            </h2>
            <p className="text-sm sm:text-base text-[#6B665F] leading-relaxed">
              Explora el recetario general y marca las que más te inspiren para tenerlas aquí a un clic.
            </p>
          </div>

          <div className="pt-2">
            <Link
              href="/"
              className="inline-flex items-center gap-2 justify-center px-6 py-3 rounded-full bg-[#C86D51] hover:bg-[#B25C42] text-white text-sm font-medium transition-colors shadow-sm"
            >
              <Compass className="w-4 h-4" />
              <span>Explorar catálogo</span>
            </Link>
          </div>
        </section>
      )}
    </div>
  );
}