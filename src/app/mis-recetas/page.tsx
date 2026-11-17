import Link from "next/link";
import { redirect } from "next/navigation";
import { BookOpen, Pencil, Plus } from "lucide-react";
import { auth } from "@/lib/auth";
import { RecipeService } from "@/server/services/recipe.service";
import { RecipeCard } from "@/components/recipes/RecipeCard";
import { DeleteRecipeButton } from "@/components/recipes/DeleteRecipeButton";

export default async function MisRecetasPage() {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) {
    redirect("/");
  }

  const [recipes, favoriteIds] = await Promise.all([
    RecipeService.getRecipesByAuthorId(userId),
    RecipeService.getUserFavoriteIds(userId),
  ]);

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-8">
      {/* Cabecera distintiva de Taller Personal (Verde Oliva) */}
      <header className="rounded-3xl bg-[#E3EBE5]/60 border border-[#4A6B53]/25 p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/90 border border-[#4A6B53]/20 text-[#2F4435] text-xs font-semibold tracking-wide uppercase">
            <BookOpen className="w-3.5 h-3.5 text-[#4A6B53]" />
            <span>Mi Recetario Personal</span>
          </div>

          <h1 className="font-serif text-3xl sm:text-4xl text-[#23211E] tracking-tight">
            Mis recetas publicadas
          </h1>

          <p className="text-sm sm:text-base text-[#6B665F] max-w-2xl">
            Gestiona tus creaciones culinarias, revisa tus apuntes familiares o comparte una nueva elaboración con la comunidad.
          </p>
        </div>

        <div className="flex sm:flex-col items-center sm:items-end justify-between gap-3 shrink-0">
          <span className="text-xs font-medium text-[#2F4435] bg-white/80 px-3 py-1.5 rounded-xl border border-[#4A6B53]/20">
            {recipes.length} {recipes.length === 1 ? "receta creada" : "recetas creadas"}
          </span>

          <Link
            href="/recetas/nueva"
            className="inline-flex items-center gap-2 bg-[#2F4435] hover:bg-[#3D5844] text-white px-5 py-2.5 rounded-full text-sm font-medium transition-colors shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>Nueva receta</span>
          </Link>
        </div>
      </header>

      {/* Listado de recetas propias con barra integrada en la tarjeta */}
      {recipes.length > 0 ? (
        <section aria-label="Tus recetas">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {recipes.map((recipe) => (
              <RecipeCard
                key={recipe.id}
                recipe={recipe}
                isFavorite={favoriteIds.includes(recipe.id)}
                isAuthenticated={true}
                footerAction={
                  <>
                    <span className="text-[11px] text-[#9E988F]">
                      {new Date(recipe.createdAt).toLocaleDateString("es-ES", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </span>
                    <div className="flex items-center gap-2">
                      <Link
                        href={`/recetas/${recipe.id}/editar`}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium text-[#2F4435] bg-[#E3EBE5]/70 hover:bg-[#E3EBE5] border border-[#4A6B53]/20 transition-colors"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                        <span>Editar</span>
                      </Link>
                      <DeleteRecipeButton
                        recipeId={recipe.id}
                        recipeTitle={recipe.title}
                      />
                    </div>
                  </>
                }
              />
            ))}
          </div>
        </section>
      ) : (
        <section className="w-full rounded-2xl border-2 border-dashed border-[#E7E2DA] bg-white/60 p-10 sm:p-16 text-center space-y-5">
          <div className="w-16 h-16 mx-auto rounded-full bg-[#E3EBE5] text-[#2F4435] flex items-center justify-center">
            <BookOpen className="w-7 h-7" />
          </div>

          <div className="space-y-2 max-w-md mx-auto">
            <h2 className="font-serif text-2xl text-[#23211E] font-medium">
              Tu cuaderno aún está en blanco
            </h2>
            <p className="text-sm sm:text-base text-[#6B665F] leading-relaxed">
              Anímate a guardar esa receta que siempre triunfa en casa para tenerla siempre a mano.
            </p>
          </div>

          <div className="pt-2">
            <Link
              href="/recetas/nueva"
              className="inline-flex items-center justify-center px-6 py-3 rounded-full bg-[#2F4435] hover:bg-[#3D5844] text-white text-sm font-medium transition-colors shadow-sm"
            >
              + Crear mi primera receta
            </Link>
          </div>
        </section>
      )}
    </div>
  );
}