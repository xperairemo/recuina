import Link from "next/link";
import Image from "next/image";
import { RecipeCardItem } from "@/types/recipe.types";
import { Difficulty } from "@prisma/client";

interface RecipeCardProps {
  recipe: RecipeCardItem;
}

const difficultyLabels: Record<Difficulty, { label: string; colorClass: string }> = {
  FACIL: {
    label: "Fácil",
    colorClass: "bg-emerald-100 text-emerald-800 border-emerald-200",
  },
  MEDIA: {
    label: "Media",
    colorClass: "bg-amber-100 text-amber-800 border-amber-200",
  },
  DIFICIL: {
    label: "Difícil",
    colorClass: "bg-rose-100 text-rose-800 border-rose-200",
  },
};

export function RecipeCard({ recipe }: RecipeCardProps) {
  const difficultyInfo = difficultyLabels[recipe.difficulty];
  const totalTime = recipe.prepTime + (recipe.cookTime || 0);

  return (
    <article className="group relative flex flex-col overflow-hidden rounded-2xl border border-[#E7E2DA] bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md">
      {/* 1. Contenedor de la Imagen de Portada */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#F4F0EB]">
        {recipe.imageUrl ? (
          <Image
            src={recipe.imageUrl}
            alt={`Fotografía de ${recipe.title}`}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-[#FAF8F5] to-[#E7E2DA] text-[#9E988F]">
            <span className="text-sm font-medium">Sin fotografía</span>
          </div>
        )}

        {/* Badge de Dificultad superpuesto */}
        <div className="absolute top-3 right-3">
          <span
            className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold backdrop-blur-sm ${difficultyInfo.colorClass}`}
          >
            {difficultyInfo.label}
          </span>
        </div>
      </div>

      {/* 2. Cuerpo de la Tarjeta */}
      <div className="flex flex-1 flex-col p-5">
        {/* Región de origen si está informada */}
        {recipe.region && (
          <p className="mb-1 text-xs font-semibold tracking-wide text-[#C86D51] uppercase">
            {recipe.region}
          </p>
        )}

        {/* Título de la Receta con enlace accesible al detalle */}
        <h3 className="mb-2 line-clamp-1 font-serif text-xl font-bold text-[#23211E] transition-colors group-hover:text-[#4A6B53]">
          <Link href={`/recetas/${recipe.id}`} className="focus:outline-none">
            <span className="absolute inset-0" aria-hidden="true" />
            {recipe.title}
          </Link>
        </h3>

        {/* Descripción truncada a 2 líneas */}
        <p className="mb-4 line-clamp-2 text-sm text-[#6B665F]">
          {recipe.description}
        </p>

        {/* Metadatos: Tiempo y Raciones */}
        <div className="mt-auto flex items-center gap-4 border-t border-[#E7E2DA] pt-3 text-xs text-[#6B665F]">
          <div className="flex items-center gap-1.5" title="Tiempo total estimado">
            <svg
              className="h-4 w-4 text-[#9E988F]"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span>{totalTime} min</span>
          </div>

          <div className="flex items-center gap-1.5" title="Número de raciones">
            <svg
              className="h-4 w-4 text-[#9E988F]"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
            <span>{recipe.servings} rac.</span>
          </div>

          {/* Contador de favoritos */}
          {recipe._count.favorites > 0 && (
            <div className="ml-auto flex items-center gap-1 text-[#C86D51]">
              <svg className="h-3.5 w-3.5 fill-current" viewBox="0 0 20 20">
                <path d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" />
              </svg>
              <span>{recipe._count.favorites}</span>
            </div>
          )}
        </div>
      </div>
    </article>
  );
}