import { prisma } from "@/lib/prisma";
import { RecipeInput } from "@/lib/validations/recipe";
import { RecipeCardItem, RecipeFiltersQuery, RecipeWithDetails } from "@/types/recipe.types";
import { Prisma } from "@prisma/client";

export class RecipeService {
  /**
   * Obtiene el listado de recetas para el catálogo principal aplicando filtros dinámicos.
   */
  static async getRecipes(filters?: RecipeFiltersQuery): Promise<RecipeCardItem[]> {
    const where: Prisma.RecipeWhereInput = {};

    if (filters?.search) {
      where.OR = [
        { title: { contains: filters.search, mode: "insensitive" } },
        { description: { contains: filters.search, mode: "insensitive" } },
      ];
    }

    if (filters?.region) {
      where.region = { contains: filters.region, mode: "insensitive" };
    }

    if (filters?.difficulty) {
      where.difficulty = filters.difficulty;
    }

    if (filters?.maxTime) {
      where.cookTimeMinutes = { lte: filters.maxTime };
    }

    // Filtro "¿Qué tienes a mano?": recetas que contengan al menos uno de los ingredientes indicados
    if (filters?.ingredients && filters.ingredients.length > 0) {
      where.ingredients = {
        some: {
          name: {
            in: filters.ingredients,
            mode: "insensitive",
          },
        },
      };
    }

    return prisma.recipe.findMany({
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
  }

  /**
   * Obtiene el detalle completo de una receta por su identificador.
   */
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

  /**
   * Obtiene las recetas creadas por un usuario en particular (para /mis-recetas).
   */
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

  /**
   * Crea una receta de forma transaccional junto con sus ingredientes y pasos.
   */
  static async createRecipe(authorId: string, data: RecipeInput): Promise<RecipeWithDetails> {
    return prisma.recipe.create({
      data: {
        title: data.title,
        description: data.description || null,
        cookTimeMinutes: data.cookTimeMinutes,
        difficulty: data.difficulty,
        region: data.region,
        imageUrl: data.imageUrl || null,
        authorId,
        ingredients: {
          create: data.ingredients.map((ing, index) => ({
            name: ing.name,
            amount: ing.amount || null,
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

  /**
   * Elimina una receta verificando que el usuario solicitante sea el autor legítimo.
   */
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