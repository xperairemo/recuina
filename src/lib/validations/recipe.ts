import { z } from "zod";

export const difficultyEnum = z.enum(["EASY", "MEDIUM", "HARD"], {
  message: "Selecciona una dificultad válida",
});

export const ingredientSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "El nombre del ingrediente no puede estar vacío")
    .max(100, "El nombre del ingrediente es demasiado largo"),
  amount: z
    .string()
    .trim()
    .max(50, "La cantidad es demasiado larga")
    .optional()
    .or(z.literal("")),
  order: z.number().int().nonnegative().default(0),
});

export const stepSchema = z.object({
  instruction: z
    .string()
    .trim()
    .min(3, "La instrucción del paso debe tener al menos 3 caracteres"),
  order: z.number().int().positive("El orden del paso debe ser mayor que 0"),
});

export const recipeSchema = z.object({
  title: z
    .string()
    .trim()
    .min(3, "El título debe tener al menos 3 caracteres")
    .max(120, "El título no puede superar los 120 caracteres"),
  description: z
    .string()
    .trim()
    .max(2000, "La descripción no puede superar los 2000 caracteres")
    .optional()
    .or(z.literal("")),
  cookTimeMinutes: z.coerce
    .number({ message: "Introduce un tiempo de preparación válido" })
    .int("El tiempo debe ser un número entero")
    .positive("El tiempo de preparación debe ser mayor que 0 minutos")
    .max(1440, "El tiempo máximo permitido es 24 horas (1440 minutos)"),
  difficulty: difficultyEnum.default("EASY"),
  region: z
    .string()
    .trim()
    .min(2, "Indica una comarca, municipio o región válida")
    .max(100, "El nombre de la región es demasiado largo"),
  imageUrl: z
    .string()
    .url("La URL de la imagen no es válida")
    .optional()
    .or(z.literal("")),
  ingredients: z
    .array(ingredientSchema)
    .min(1, "Debes añadir al menos un ingrediente a la receta"),
  steps: z
    .array(stepSchema)
    .min(1, "Debes incluir al menos un paso de preparación"),
});

export type RecipeInput = z.infer<typeof recipeSchema>;
export type IngredientInput = z.infer<typeof ingredientSchema>;
export type StepInput = z.infer<typeof stepSchema>;