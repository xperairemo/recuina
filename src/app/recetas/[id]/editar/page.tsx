import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { auth } from "@/lib/auth";
import { RecipeService } from "@/server/services/recipe.service";
import { RecipeForm } from "@/components/recipes/RecipeForm";


interface EditarRecetaPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditarRecetaPage({
  params,
}: EditarRecetaPageProps) {
  const [{ id }, session] = await Promise.all([params, auth()]);
  const userId = session?.user?.id;

  if (!userId) {
    redirect("/");
  }

  const recipe = await RecipeService.getRecipeById(id);

  if (!recipe) {
    notFound();
  }

  // Solo el autor original puede editar su receta (RF-02.3)
  if (recipe.authorId !== userId) {
    redirect(`/recetas/${id}`);
  }

  return (
    <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <nav>
        <Link
          href={`/recetas/${recipe.id}`}
          className="inline-flex items-center gap-2 text-sm text-stone-500 hover:text-stone-900 transition-colors"
        >
          <span>←</span> Volver a la receta
        </Link>
      </nav>

      <header className="space-y-2 border-b border-stone-200 pb-6">
        <h1 className="font-serif text-3xl sm:text-4xl text-stone-900 tracking-tight">
          Editar receta
        </h1>
        <p className="text-stone-600 text-sm sm:text-base">
          Actualiza los ingredientes, pasos, fotografía o historia de «{recipe.title}».
        </p>
      </header>

      <RecipeForm
        initialData={{
          id: recipe.id,
          title: recipe.title,
          description: recipe.description,
          prepTime: recipe.prepTime,
          cookTime: recipe.cookTime,
          servings: recipe.servings,
          difficulty: recipe.difficulty,
          region: recipe.region,
          familyStory: recipe.familyStory,
          imageUrl: recipe.imageUrl,
          ingredients: recipe.ingredients.map((ing) => ({
            name: ing.name,
            quantity: ing.quantity,
            unit: ing.unit,
          })),
          steps: recipe.steps.map((st) => ({
            instruction: st.instruction,
          })),
        }}
      />
    </div>
  );
}