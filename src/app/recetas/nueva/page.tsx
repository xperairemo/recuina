import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { RecipeForm } from "@/components/recipes/RecipeForm";

export default async function NuevaRecetaPage() {
  const session = await auth();

  // Protección en servidor: si no hay sesión, al catálogo
  if (!session?.user) {
    redirect("/");
  }

  return (
    <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <header className="space-y-2 border-b border-stone-200 pb-6">
        <h1 className="font-serif text-3xl sm:text-4xl text-stone-900 tracking-tight">
          Nueva receta
        </h1>
        <p className="text-stone-600 text-sm sm:text-base">
          Comparte los secretos, medidas e historia de tu plato familiar.
        </p>
      </header>

      <RecipeForm />
    </div>
  );
}