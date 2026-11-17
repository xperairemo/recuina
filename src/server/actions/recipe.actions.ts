"use server";

import { auth } from "@/lib/auth";
import { recipeSchema, RecipeInput } from "@/lib/validations/recipe";
import { RecipeService } from "@/server/services/recipe.service";
import { revalidatePath } from "next/cache";
import { supabaseAdmin } from "@/lib/supabase";
import { commentSchema } from "@/lib/validations/comment"

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

export async function updateRecipeAction(
  recipeId: string,
  rawInput: RecipeInput
): Promise<ActionResponse<{ id: string }>> {
  try {
    const session = await auth();
    const userId = session?.user?.id;

    if (!userId) {
      return {
        success: false,
        message: "Debes iniciar sesión para editar una receta.",
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

    const newImageUrl = validationResult.data.imageUrl || null;

    const result = await RecipeService.updateRecipe(
      recipeId,
      userId,
      validationResult.data
    );

    if (!result.updated) {
      return {
        success: false,
        message: "No se encontró la receta o no tienes permisos para editarla.",
      };
    }

    // Si había una foto anterior y cambió o se eliminó, borramos el archivo antiguo de Storage
    if (
      result.previousImageUrl &&
      result.previousImageUrl !== newImageUrl &&
      result.previousImageUrl.includes("/recipe-images/")
    ) {
      const oldStoragePath = result.previousImageUrl.split("/recipe-images/")[1];
      if (oldStoragePath) {
        await supabaseAdmin.storage.from("recipe-images").remove([oldStoragePath]);
      }
    }

    revalidatePath("/");
    revalidatePath("/recetas");
    revalidatePath("/mis-recetas");
    revalidatePath("/favoritos");
    revalidatePath(`/recetas/${recipeId}`);

    return {
      success: true,
      message: "¡Receta actualizada con éxito!",
      data: { id: recipeId },
    };
  } catch (error) {
    console.error("Error en updateRecipeAction:", error);
    return {
      success: false,
      message: "Ocurrió un error inesperado al actualizar la receta.",
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

    const result = await RecipeService.deleteRecipe(recipeId, userId);

    if (!result.deleted) {
      return {
        success: false,
        message: "No se encontró la receta o no tienes permisos para eliminarla.",
      };
    }

    // Si la receta tenía imagen en Supabase Storage, la eliminamos para no dejar huérfanos
    if (result.imageUrl && result.imageUrl.includes("/recipe-images/")) {
      const storagePath = result.imageUrl.split("/recipe-images/")[1];
      if (storagePath) {
        await supabaseAdmin.storage.from("recipe-images").remove([storagePath]);
      }
    }

    revalidatePath("/");
    revalidatePath("/recetas");
    revalidatePath("/mis-recetas");
    revalidatePath("/favoritos");
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

export async function uploadRecipeImageAction(
  formData: FormData
): Promise<ActionResponse<{ imageUrl: string }>> {
  try {
    const session = await auth();
    const userId = session?.user?.id;

    if (!userId) {
      return {
        success: false,
        message: "Debes iniciar sesión para subir imágenes.",
      };
    }

    const file = formData.get("image") as File | null;
    if (!file || file.size === 0) {
      return {
        success: false,
        message: "No se ha proporcionado ningún archivo válido.",
      };
    }

    const MAX_SIZE = 2 * 1024 * 1024;
    if (file.size > MAX_SIZE) {
      return {
        success: false,
        message: "La imagen no puede superar los 2 MB.",
      };
    }

    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      return {
        success: false,
        message: "Formato no compatible. Usa JPG, PNG o WebP.",
      };
    }

    const cleanFileName = file.name
      .toLowerCase()
      .replace(/[^a-z0-9.]/g, "-")
      .replace(/-+/g, "-");
    const filePath = `recipes/${userId}/${Date.now()}_${cleanFileName}`;

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const { error: uploadError } = await supabaseAdmin.storage
      .from("recipe-images")
      .upload(filePath, buffer, {
        contentType: file.type,
        upsert: false,
      });

    if (uploadError) {
      console.error("Error al subir a Supabase Storage:", uploadError);
      return {
        success: false,
        message: `Error al subir la imagen: ${uploadError.message}`,
      };
    }

    const { data: publicUrlData } = supabaseAdmin.storage
      .from("recipe-images")
      .getPublicUrl(filePath);

    return {
      success: true,
      message: "Imagen subida con éxito.",
      data: { imageUrl: publicUrlData.publicUrl },
    };
  } catch (error) {
    console.error("Error inesperado en uploadRecipeImageAction:", error);
    return {
      success: false,
      message: "Ocurrió un error en el servidor al procesar la imagen.",
    };
  }
}

export async function toggleFavoriteAction(
  recipeId: string
): Promise<ActionResponse<{ isFavorite: boolean }>> {
  try {
    const session = await auth();
    const userId = session?.user?.id;

    if (!userId) {
      return {
        success: false,
        message: "Inicia sesión con Google para guardar recetas en favoritos.",
      };
    }

    const result = await RecipeService.toggleFavorite(userId, recipeId);

    revalidatePath("/");
    revalidatePath("/mis-recetas");
    revalidatePath("/favoritos");
    revalidatePath(`/recetas/${recipeId}`);

    return {
      success: true,
      message: result.isFavorite
        ? "Receta guardada en favoritos."
        : "Receta eliminada de favoritos.",
      data: result,
    };
  } catch (error) {
    console.error("Error en toggleFavoriteAction:", error);
    return {
      success: false,
      message: "No se pudo actualizar tus favoritos.",
    };
  }
}

export async function createCommentAction(
  recipeId: string,
  content: string
): Promise<ActionResponse> {
  try {
    const session = await auth();
    const userId = session?.user?.id;

    if (!userId) {
      return {
        success: false,
        message: "Debes iniciar sesión con Google para dejar un comentario.",
      };
    }

    const validation = commentSchema.safeParse({ recipeId, content });
    if (!validation.success) {
      const firstError =
        validation.error.flatten().fieldErrors.content?.[0] ??
        "El comentario no es válido.";
      return {
        success: false,
        message: firstError,
      };
    }

    await RecipeService.createComment(
      userId,
      validation.data.recipeId,
      validation.data.content
    );

    revalidatePath(`/recetas/${recipeId}`);

    return {
      success: true,
      message: "Comentario publicado.",
    };
  } catch (error) {
    if (error instanceof Error && error.message === "RATE_LIMIT") {
      return {
        success: false,
        message: "Espera unos segundos antes de publicar otro comentario.",
      };
    }
    console.error("Error en createCommentAction:", error);
    return {
      success: false,
      message: "No se pudo publicar el comentario en este momento.",
    };
  }
}

export async function deleteCommentAction(
  commentId: string,
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

    const deleted = await RecipeService.deleteComment(commentId, userId);

    if (!deleted) {
      return {
        success: false,
        message: "No tienes permisos para eliminar este comentario.",
      };
    }

    revalidatePath(`/recetas/${recipeId}`);

    return {
      success: true,
      message: "Comentario eliminado.",
    };
  } catch (error) {
    console.error("Error en deleteCommentAction:", error);
    return {
      success: false,
      message: "Ocurrió un error al eliminar el comentario.",
    };
  }
}