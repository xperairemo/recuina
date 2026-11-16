"use client";

import { useOptimistic, useTransition } from "react";
import { Bookmark } from "lucide-react";
import { toggleFavoriteAction } from "@/server/actions/recipe.actions";

interface FavoriteButtonProps {
  recipeId: string;
  initialIsFavorite: boolean;
  isAuthenticated: boolean;
  variant?: "icon" | "pill";
}

export function FavoriteButton({
  recipeId,
  initialIsFavorite,
  isAuthenticated,
  variant = "icon",
}: FavoriteButtonProps) {
  const [isPending, startTransition] = useTransition();
  const [optimisticFavorite, setOptimisticFavorite] = useOptimistic(
    initialIsFavorite,
    (_current, nextState: boolean) => nextState
  );

  const handleToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated) {
      alert("Inicia sesión con tu cuenta de Google para guardar recetas en favoritos.");
      return;
    }

    startTransition(async () => {
      const nextState = !optimisticFavorite;
      setOptimisticFavorite(nextState);

      const result = await toggleFavoriteAction(recipeId);
      if (!result.success) {
        setOptimisticFavorite(!nextState);
        if (result.message) alert(result.message);
      }
    });
  };

  if (variant === "pill") {
    return (
      <button
        type="button"
        onClick={handleToggle}
        disabled={isPending}
        aria-pressed={optimisticFavorite}
        className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs sm:text-sm font-medium border transition-all cursor-pointer ${
          optimisticFavorite
            ? "bg-[#FDF6F3] border-[#C86D51]/40 text-[#B25C42] shadow-2xs"
            : "bg-white border-[#E7E2DA] text-[#6B665F] hover:text-[#23211E] hover:border-stone-300"
        }`}
      >
        <Bookmark
          className={`w-4 h-4 transition-transform ${
            optimisticFavorite ? "fill-[#C86D51] text-[#C86D51] scale-110" : ""
          }`}
        />
        <span>{optimisticFavorite ? "Guardada en favoritos" : "Guardar receta"}</span>
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={handleToggle}
      disabled={isPending}
      aria-label={
        optimisticFavorite ? "Quitar de favoritos" : "Guardar en favoritos"
      }
      aria-pressed={optimisticFavorite}
      title={optimisticFavorite ? "Quitar de favoritos" : "Guardar en favoritos"}
      className={`relative z-10 w-8 h-8 rounded-full flex items-center justify-center backdrop-blur-sm border transition-all cursor-pointer ${
        optimisticFavorite
          ? "bg-[#2F4435] border-[#2F4435] text-white shadow-sm"
          : "bg-white/90 border-[#E7E2DA] text-[#6B665F] hover:text-[#23211E] hover:bg-white"
      }`}
    >
      <Bookmark
        className={`w-4 h-4 transition-transform ${
          optimisticFavorite ? "fill-current scale-105" : ""
        }`}
      />
    </button>
  );
}