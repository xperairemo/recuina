"use server";

import { auth } from "@/lib/auth";
import { recipeSchema, RecipeInput } from "@/lib/validations/recipe";
import { RecipeService } from "@/server/services/recipe.service";
import { revalidatePath } from "next/cache";

export type ActionResponse<T = unknown> = {
  success: boolean;
  message?: string;
  data?: T;
  errors?: Record<string, string[]>;
};

export async function createRecipeAction(
  rawInput: RecipeInput
): Promise<ActionResponse<{ id: string }>> {
  try {
    const session = await auth();
    const userId = session?.user?.id;

    if (!userId) {
      return {
        success: false,
        message: "Debes iniciar sesión para publicar una receta.",
      };
    }

    const validationResult = recipeSchema.safeParse(rawInput);

    if (!validationResult.success) {
      return {
        success: false,
        message: "Los datos de la receta contienen errores.",
        errors: validationResult.error.flatten().fieldErrors,
      };
    }

    const newRecipe = await RecipeService.createRecipe(
      userId,
      validationResult.data
    );

    revalidatePath("/");
    revalidatePath("/recetas");
    revalidatePath("/mis-recetas");

    return {
      success: true,
      message: "¡Receta creada con éxito!",
      data: { id: newRecipe.id },
    };
  } catch (error) {
    console.error("Error en createRecipeAction:", error);
    return {
      success: false,
      message: "Ocurrió un error inesperado en el servidor al guardar la receta.",
    };
  }
}

export async function deleteRecipeAction(
  recipeId: string
): Promise<ActionResponse> {
  try {
    const session = await auth();
    const userId = session?.user?.id;

    if (!userId) {
      return {
        success: false,
        message: "No tienes autorización para realizar esta acción.",
      };
    }

    const deleted = await RecipeService.deleteRecipe(recipeId, userId);

    if (!deleted) {
      return {
        success: false,
        message: "No se encontró la receta o no tienes permisos para eliminarla.",
      };
    }

    revalidatePath("/recetas");
    revalidatePath("/mis-recetas");
    revalidatePath(`/recetas/${recipeId}`);

    return {
      success: true,
      message: "Receta eliminada correctamente.",
    };
  } catch (error) {
    console.error("Error en deleteRecipeAction:", error);
    return {
      success: false,
      message: "No se pudo eliminar la receta debido a un error del servidor.",
    };
  }
}