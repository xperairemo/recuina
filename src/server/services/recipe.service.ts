import { prisma } from "@/lib/prisma";
import { RecipeInput } from "@/lib/validations/recipe";
import { RecipeCardItem, RecipeFiltersQuery, RecipeWithDetails } from "@/types/recipe.types";
import { Difficulty, Prisma } from "@prisma/client";

export class RecipeService {
  
  static async getRecipes(filters?: RecipeFiltersQuery): Promise<RecipeCardItem[]> {
    const where: Prisma.RecipeWhereInput = {
      isPublished: true,
    };

    if (filters?.search) {
      where.OR = [
        { title: { contains: filters.search, mode: "insensitive" } },
        { description: { contains: filters.search, mode: "insensitive" } },
      ];
    }

    if (filters?.region) {
      where.region = { equals: filters.region, mode: "insensitive" };
    }

    if (filters?.difficulty) {
      where.difficulty = filters.difficulty;
    }

    if (filters?.ingredients && filters.ingredients.length > 0) {
      where.ingredients = {
        some: {
          OR: filters.ingredients.map((ing) => ({
            name: {
              contains: ing,
              mode: "insensitive",
            },
          })),
        },
      };
    }

    const recipes = await prisma.recipe.findMany({
      where,
      orderBy: {
        createdAt: "desc",
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
        _count: {
          select: {
            favorites: true,
          },
        },
      },
    });

    if (filters?.maxTotalTime) {
      return recipes.filter(
        (r) => r.prepTime + (r.cookTime ?? 0) <= filters.maxTotalTime!
      );
    }
    return recipes;
  }

  static async getAvailableRegions(): Promise<string[]> {
    const results = await prisma.recipe.findMany({
      where: {
        isPublished: true,
        region: { not: null },
      },
      select: { region: true },
      distinct: ["region"],
      orderBy: { region: "asc" },
    });
    return results
      .map((r) => r.region)
      .filter((region): region is string => Boolean(region && region.trim()));
  }

  static async getRecipeById(id: string): Promise<RecipeWithDetails | null> {
    return prisma.recipe.findUnique({
      where: { id },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
        ingredients: {
          orderBy: {
            order: "asc",
          },
        },
        steps: {
          orderBy: {
            order: "asc",
          },
        },
        _count: {
          select: {
            favorites: true,
            comments: true,
          },
        },
      },
    });
  }

  static async getRecipesByAuthorId(authorId: string): Promise<RecipeCardItem[]> {
    return prisma.recipe.findMany({
      where: { authorId },
      orderBy: { createdAt: "desc" },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
        _count: {
          select: {
            favorites: true,
          },
        },
      },
    });
  }

  static async getUserStats(userId: string): Promise<{ myRecipesCount: number; favoritesCount: number }> {
    const [myRecipesCount, favoritesCount] = await Promise.all([
      prisma.recipe.count({
        where: { authorId: userId },
      }),
      prisma.favorite.count({
        where: { userId },
      }),
    ]);

    return { myRecipesCount, favoritesCount };
  }

  static async createRecipe(authorId: string, data: RecipeInput): Promise<RecipeWithDetails> {
    return prisma.recipe.create({
      data: {
        title: data.title,
        description: data.description,
        prepTime: data.prepTime,
        cookTime: data.cookTime ?? null,
        servings: data.servings,
        difficulty: data.difficulty as Difficulty,
        region: data.region || null,
        familyStory: data.familyStory || null,
        imageUrl: data.imageUrl || null,
        isPublished: data.isPublished ?? true,
        authorId,
        ingredients: {
          create: data.ingredients.map((ing, index) => ({
            name: ing.name,
            quantity: ing.quantity ?? null,
            unit: ing.unit || null,
            order: ing.order ?? index + 1,
          })),
        },
        steps: {
          create: data.steps.map((st, index) => ({
            instruction: st.instruction,
            order: st.order ?? index + 1,
          })),
        },
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
        ingredients: {
          orderBy: {
            order: "asc",
          },
        },
        steps: {
          orderBy: {
            order: "asc",
          },
        },
        _count: {
          select: {
            favorites: true,
            comments: true,
          },
        },
      },
    });
  }

  static async deleteRecipe(recipeId: string, authorId: string): Promise<boolean> {
    const recipe = await prisma.recipe.findUnique({
      where: { id: recipeId },
      select: { authorId: true },
    });

    if (!recipe || recipe.authorId !== authorId) {
      return false;
    }

    await prisma.recipe.delete({
      where: { id: recipeId },
    });

    return true;
  }
}