import { z } from "zod";

export const commentSchema = z.object({
  recipeId: z.string().min(1, "El identificador de la receta es obligatorio."),
  content: z
    .string()
    .trim()
    .min(3, "El comentario debe tener al menos 3 caracteres.")
    .max(600, "El comentario no puede superar los 600 caracteres."),
});

export type CommentInput = z.infer<typeof commentSchema>;