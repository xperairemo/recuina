"use server";

import { auth } from "@/lib/auth";
import { recipeSchema, RecipeInput } from "@/lib/validations/recipe";
import { RecipeService } from "@/server/services/recipe.service";
import { revalidatePath } from "next/cache";
import { supabaseAdmin } from "@/lib/supabase";

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