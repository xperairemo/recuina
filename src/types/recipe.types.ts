import { Difficulty, Prisma } from "@prisma/client";
import { RecipeInput } from "@/lib/validations/recipe";

export type { RecipeInput, IngredientInput, StepInput } from "@/lib/validations/recipe";

export type RecipeWithDetails = Prisma.RecipeGetPayload<{
  include: {
    author: {
      select: {
        id: true;
        name: true;
        image: true;
      };
    };
    ingredients: {
      orderBy: {
        order: "asc";
      };
    };
    steps: {
      orderBy: {
        order: "asc";
      };
    };
    _count: {
      select: {
        favorites: true;
        comments: true;
      };
    };
  };
}>;

export type RecipeCardItem = Prisma.RecipeGetPayload<{
  include: {
    author: {
      select: {
        id: true;
        name: true;
        image: true;
      };
    };
    _count: {
      select: {
        favorites: true;
      };
    };
  };
}>;

export interface RecipeFiltersQuery {
  search?: string;
  region?: string;
  difficulty?: Difficulty;
  maxTotalTime?: number; // prepTime + (cookTime || 0)
  ingredients?: string[];
}