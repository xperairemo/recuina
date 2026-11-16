"use client";

import { useTransition } from "react";
import { Trash2 } from "lucide-react";
import { deleteRecipeAction } from "@/server/actions/recipe.actions";

interface DeleteRecipeButtonProps {
  recipeId: string;
  recipeTitle: string;
}

export function DeleteRecipeButton({
  recipeId,
  recipeTitle,
}: DeleteRecipeButtonProps) {
  const [isPending, startTransition] = useTransition();

  const handleDelete = () => {
    const confirmed = window.confirm(
      `¿Seguro que quieres eliminar "${recipeTitle}"? Esta acción no se puede deshacer.`
    );
    if (!confirmed) return;

    startTransition(async () => {
      const result = await deleteRecipeAction(recipeId);
      if (!result.success && result.message) {
        alert(result.message);
      }
    });
  };

  return (
    <button
      type="button"
      onClick={handleDelete}
      disabled={isPending}
      title="Eliminar receta"
      className="relative z-10 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200/80 transition-colors disabled:opacity-50 cursor-pointer"
    >
      <Trash2 className="w-3.5 h-3.5" />
      <span>{isPending ? "Eliminando..." : "Eliminar"}</span>
    </button>
  );
}