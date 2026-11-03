import { z } from "zod";

export const difficultyEnum = z.enum(["FACIL", "MEDIA", "DIFICIL"], {
  message: "Selecciona una dificultad válida",
});

export const ingredientSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "El nombre del ingrediente no puede estar vacío")
    .max(100, "El nombre del ingrediente es demasiado largo"),
  quantity: z.coerce
    .number({ message: "La cantidad debe ser un número" })
    .positive("La cantidad debe ser positiva")
    .optional()
    .nullable(),
  unit: z
    .string()
    .trim()
    .max(30, "La unidad es demasiado larga")
    .optional()
    .nullable()
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
    .min(10, "Añade una breve descripción de al menos 10 caracteres")
    .max(2000, "La descripción no puede superar los 2000 caracteres"),
  prepTime: z.coerce
    .number({ message: "Introduce el tiempo de preparación en minutos" })
    .int("Debe ser un número entero")
    .positive("El tiempo de preparación debe ser mayor que 0 minutos"),
  cookTime: z.coerce
    .number({ message: "Introduce el tiempo de cocinado en minutos" })
    .int("Debe ser un número entero")
    .nonnegative("No puede ser negativo")
    .optional()
    .nullable(),
  servings: z.coerce
    .number({ message: "Introduce el número de raciones" })
    .int("Las raciones deben ser un número entero")
    .positive("Debe ser al menos 1 ración"),
  difficulty: difficultyEnum.default("FACIL"),
  region: z
    .string()
    .trim()
    .max(100, "El nombre de la comarca o región es demasiado largo")
    .optional()
    .nullable()
    .or(z.literal("")),
  familyStory: z
    .string()
    .trim()
    .max(3000, "La historia familiar no puede superar los 3000 caracteres")
    .optional()
    .nullable()
    .or(z.literal("")),
  imageUrl: z
    .string()
    .url("La URL de la imagen no es válida")
    .optional()
    .nullable()
    .or(z.literal("")),
  isPublished: z.boolean().default(true),
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