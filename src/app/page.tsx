import Link from "next/link";
import { Difficulty } from "@prisma/client";
import { auth } from "@/lib/auth";
import { RecipeCard } from "@/components/recipes/RecipeCard";
import { RecipeSearchHero } from "@/components/recipes/RecipeSearchHero";
import { RecipeService } from "@/server/services/recipe.service";

interface HomePageProps {
  searchParams: Promise<{
    search?: string;
    region?: string;
    difficulty?: string;
    maxTime?: string;
    ingredients?: string;
  }>;
}

export default async function Home({ searchParams }: HomePageProps) {
  const [session, resolvedParams, availableRegions] = await Promise.all([
    auth(),
    searchParams,
    RecipeService.getAvailableRegions(),
  ]);

  const userId = session?.user?.id;

  const validDifficulties: Difficulty[] = ["FACIL", "MEDIA", "DIFICIL"];
  const difficulty = validDifficulties.includes(
    resolvedParams.difficulty as Difficulty
  )
    ? (resolvedParams.difficulty as Difficulty)
    : undefined;

  const maxTotalTime = resolvedParams.maxTime
    ? Number(resolvedParams.maxTime)
    : undefined;

  const ingredients = resolvedParams.ingredients
    ? resolvedParams.ingredients.split(",").filter(Boolean)
    : undefined;

  const hasFilters = Boolean(
    resolvedParams.search ||
      resolvedParams.region ||
      difficulty ||
      maxTotalTime ||
      (ingredients && ingredients.length > 0)
  );

  const [recipes, favoriteIds] = await Promise.all([
    RecipeService.getRecipes({
      search: resolvedParams.search,
      region: resolvedParams.region,
      difficulty,
      maxTotalTime: Number.isNaN(maxTotalTime) ? undefined : maxTotalTime,
      ingredients,
    }),
    userId ? RecipeService.getUserFavoriteIds(userId) : Promise.resolve([]),
  ]);

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-10">
      {/* Hero + Buscador + Filtros */}
      <RecipeSearchHero
        userName={session?.user?.name}
        availableRegions={availableRegions}
      />

      {/* Cabecera de sección del catálogo */}
      <section aria-label="Listado de recetas" className="space-y-6">
        <div className="flex flex-wrap items-baseline justify-between gap-2 border-b border-[#E7E2DA] pb-3">
          <div className="flex items-baseline gap-3">
            <h2 className="font-serif text-2xl sm:text-3xl text-[#23211E]">
              {hasFilters ? "Resultados de búsqueda" : "Todas las recetas"}
            </h2>
            <span className="text-xs sm:text-sm text-[#6B665F]">
              {recipes.length}{" "}
              {recipes.length === 1
                ? "receta para inspirarte"
                : "recetas para inspirarte"}
            </span>
          </div>
        </div>

        {/* Cuadrícula de recetas o Estado Vacío */}
        {recipes.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {recipes.map((recipe) => (
              <RecipeCard
                key={recipe.id}
                recipe={recipe}
                isFavorite={favoriteIds.includes(recipe.id)}
                isAuthenticated={!!userId}
              />
            ))}
          </div>
        ) : (
          <div className="w-full rounded-2xl border-2 border-dashed border-[#E7E2DA] bg-white/60 p-10 sm:p-16 text-center space-y-5">
            <div className="w-16 h-16 mx-auto rounded-full bg-[#E3EBE5] text-[#2F4435] flex items-center justify-center text-3xl shadow-2xs">
              🍲
            </div>

            <div className="space-y-2 max-w-md mx-auto">
              <h3 className="font-serif text-2xl text-[#23211E] font-medium">
                {hasFilters
                  ? "No hemos encontrado recetas con esos filtros"
                  : "Aún no hay recetas publicadas"}
              </h3>
              <p className="text-sm sm:text-base text-[#6B665F] leading-relaxed">
                {hasFilters
                  ? "Prueba a quitar algún ingrediente o ampliar el tiempo de preparación."
                  : "Sé el primero en compartir una joya culinaria de tu familia o de tu comarca."}
              </p>
            </div>

            <div className="pt-2">
              {hasFilters ? (
                <Link
                  href="/"
                  className="inline-flex items-center justify-center px-6 py-3 rounded-full bg-[#2F4435] hover:bg-[#3D5844] text-white text-sm font-medium transition-colors shadow-sm"
                >
                  Ver todas las recetas
                </Link>
              ) : (
                <Link
                  href="/recetas/nueva"
                  className="inline-flex items-center justify-center px-6 py-3 rounded-full bg-[#2F4435] hover:bg-[#3D5844] text-white text-sm font-medium transition-colors shadow-sm"
                >
                  + Añadir la primera receta
                </Link>
              )}
            </div>
          </div>
        )}
      </section>
    </div>
  );
}