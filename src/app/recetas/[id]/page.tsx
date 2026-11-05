import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { RecipeService } from "@/server/services/recipe.service";

interface RecipeDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function RecipeDetailPage({ params }: RecipeDetailPageProps) {
  const { id } = await params;
  const recipe = await RecipeService.getRecipeById(id);

  // Si la receta no existe en Supabase, Next.js activa automáticamente la pantalla 404
  if (!recipe) {
    notFound();
  }

  // Mapeo amigable del enum de dificultad
  const difficultyLabels = {
    FACIL: "Fácil",
    MEDIA: "Media",
    DIFICIL: "Difícil",
  };

  const difficultyColors = {
    FACIL: "bg-emerald-50 text-emerald-800 border-emerald-200",
    MEDIA: "bg-amber-50 text-amber-800 border-amber-200",
    DIFICIL: "bg-rose-50 text-rose-800 border-rose-200",
  };

  const totalTime = recipe.prepTime + (recipe.cookTime ?? 0);

  return (
    <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Botón de volver al catálogo */}
      <nav>
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-stone-500 hover:text-stone-900 transition-colors"
        >
          <span>←</span> Volver a todas las recetas
        </Link>
      </nav>

      {/* Encabezado: Título, Región y Metadatos */}
      <header className="space-y-4">
        {recipe.region && (
          <span className="text-xs font-semibold tracking-wider uppercase text-amber-800 bg-amber-50 px-3 py-1 rounded-full border border-amber-200 inline-block">
            {recipe.region}
          </span>
        )}

        <h1 className="font-serif text-3xl sm:text-5xl text-stone-900 tracking-tight leading-tight">
          {recipe.title}
        </h1>

        <p className="text-stone-600 text-base sm:text-lg leading-relaxed">
          {recipe.description}
        </p>

        {/* Autor y Fecha */}
        <div className="flex items-center gap-3 pt-2 border-t border-stone-200/60">
          {recipe.author.image ? (
            <img
              src={recipe.author.image}
              alt={recipe.author.name ?? "Autor"}
              className="w-10 h-10 rounded-full border border-stone-300 object-cover"
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-stone-200 text-stone-700 font-semibold text-sm flex items-center justify-center">
              {recipe.author.name?.charAt(0).toUpperCase() ?? "U"}
            </div>
          )}
          <div>
            <p className="text-sm font-semibold text-stone-800">
              {recipe.author.name ?? "Cocinero anónimo"}
            </p>
            <p className="text-xs text-stone-400">
              Publicado el{" "}
              {new Date(recipe.createdAt).toLocaleDateString("es-ES", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </p>
          </div>
        </div>
      </header>

      {/* Fotografía principal */}
      <div className="relative w-full h-72 sm:h-96 rounded-2xl overflow-hidden bg-stone-100 border border-stone-200 shadow-sm">
        {recipe.imageUrl ? (
          <Image
            src={recipe.imageUrl}
            alt={recipe.title}
            fill
            priority
            className="object-cover"
            sizes="(max-width: 896px) 100vw, 896px"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center text-stone-400 space-y-2">
            <span className="text-4xl">🍲</span>
            <span className="text-sm font-medium">Sin fotografía de portada</span>
          </div>
        )}
      </div>

      {/* Ficha técnica rápida */}
      <section className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-5 rounded-2xl bg-white border border-stone-200 shadow-sm text-center">
        <div className="space-y-1">
          <span className="text-xs text-stone-500 font-medium">Preparación</span>
          <p className="text-lg font-semibold text-stone-800">{recipe.prepTime} min</p>
        </div>

        <div className="space-y-1">
          <span className="text-xs text-stone-500 font-medium">Cocinado</span>
          <p className="text-lg font-semibold text-stone-800">
            {recipe.cookTime ? `${recipe.cookTime} min` : "—"}
          </p>
        </div>

        <div className="space-y-1">
          <span className="text-xs text-stone-500 font-medium">Raciones</span>
          <p className="text-lg font-semibold text-stone-800">{recipe.servings} pers.</p>
        </div>

        <div className="space-y-1">
          <span className="text-xs text-stone-500 font-medium">Dificultad</span>
          <p className="text-sm font-semibold">
            <span
              className={`inline-block px-2.5 py-0.5 rounded-full border text-xs ${
                difficultyColors[recipe.difficulty]
              }`}
            >
              {difficultyLabels[recipe.difficulty]}
            </span>
          </p>
        </div>
      </section>

      {/* Historia familiar o contexto tradicional (si existe) */}
      {recipe.familyStory && (
        <section className="p-6 sm:p-8 rounded-2xl bg-[#F7F4EE] border border-[#E8E2D5] space-y-2">
          <h2 className="font-serif text-lg font-medium text-stone-800 flex items-center gap-2">
            <span>📖</span> Historia familiar y tradición
          </h2>
          <p className="text-stone-700 text-sm sm:text-base leading-relaxed italic">
            {`"${recipe.familyStory}"`}
          </p>
        </section>
      )}

      {/* Bloque central: Ingredientes y Pasos en dos columnas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Columna Izquierda: Ingredientes (1/3) */}
        <section className="md:col-span-1 space-y-4">
          <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm space-y-4 sticky top-24">
            <h2 className="font-serif text-xl text-stone-900 border-b border-stone-100 pb-3">
              Ingredientes
            </h2>

            <ul className="space-y-3">
              {recipe.ingredients.map((ing) => (
                <li
                  key={ing.id}
                  className="flex items-start justify-between text-sm py-1 border-b border-stone-100 last:border-none"
                >
                  <span className="text-stone-800 font-medium">{ing.name}</span>
                  {(ing.quantity || ing.unit) && (
                    <span className="text-stone-500 font-mono text-xs shrink-0 pl-2">
                      {ing.quantity ?? ""} {ing.unit ?? ""}
                    </span>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Columna Derecha: Pasos cronológicos (2/3) */}
        <section className="md:col-span-2 space-y-4">
          <div className="bg-white p-6 sm:p-8 rounded-2xl border border-stone-200 shadow-sm space-y-6">
            <h2 className="font-serif text-xl text-stone-900 border-b border-stone-100 pb-3">
              Pasos de elaboración
            </h2>

            <ol className="space-y-6">
              {recipe.steps.map((step, idx) => (
                <li key={step.id} className="flex gap-4 items-start">
                  <span className="w-8 h-8 rounded-full bg-[#2F4435] text-white font-semibold text-xs flex items-center justify-center shrink-0 mt-0.5">
                    {step.order ?? idx + 1}
                  </span>
                  <p className="text-stone-700 text-sm sm:text-base leading-relaxed flex-1">
                    {step.instruction}
                  </p>
                </li>
              ))}
            </ol>
          </div>
        </section>
      </div>
    </article>
  );
}