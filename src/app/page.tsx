import Link from "next/link";
import { RecipeCard } from "@/components/recipes/RecipeCard";
import { RecipeService } from "@/server/services/recipe.service";

export default async function Home() {
  // Obtenemos las recetas publicadas directamente en el servidor
  const recipes = await RecipeService.getRecipes();

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Encabezado principal */}
      <header className="space-y-3">
        <h1 className="font-serif text-3xl sm:text-5xl text-recuina-text-primary tracking-tight">
          Todas las recetas
        </h1>
        <p className="text-recuina-text-secondary text-base sm:text-lg max-w-2xl">
          Recetas de siempre y nuevas ideas para compartir alrededor de la mesa.
        </p>
      </header>

      {/* Catálogo o Estado Vacío */}
      {recipes.length > 0 ? (
        <section aria-label="Listado de recetas">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {recipes.map((recipe) => (
              <RecipeCard key={recipe.id} recipe={recipe} />
            ))}
          </div>
        </section>
      ) : (
        <section
          aria-label="Sin recetas disponibles"
          className="w-full rounded-2xl border-2 border-dashed border-recuina-border bg-white/60 p-10 sm:p-16 text-center space-y-5"
        >
          <div className="w-16 h-16 mx-auto rounded-full bg-recuina-olive-50 text-recuina-olive-700 flex items-center justify-center text-3xl shadow-sm">
            🍲
          </div>
          
          <div className="space-y-2 max-w-md mx-auto">
            <h2 className="font-serif text-2xl text-recuina-text-primary font-medium">
              Aún no hay recetas publicadas
            </h2>
            <p className="text-sm sm:text-base text-recuina-text-secondary leading-relaxed">
              Sé el primero en compartir una joya culinaria de tu familia o de tu comarca.
            </p>
          </div>

          <div className="pt-2">
            <Link
              href="/recetas/nueva"
              className="inline-flex items-center justify-center px-6 py-3 rounded-pill bg-recuina-olive-800 hover:bg-recuina-olive-700 text-white text-sm font-medium transition-colors shadow-sm"
            >
              + Añadir la primera receta
            </Link>
          </div>
        </section>
      )}
    </div>
  );
}