import { RecipeCard } from "@/components/recipes/RecipeCard";
import { RecipeCardItem } from "@/types/recipe.types";

// Objeto de prueba para validar RecipeCard sin tocar la base de datos
const mockRecipe: RecipeCardItem = {
  id: "test-1",
  title: "Arroz al Horno Tradicional",
  description: "Receta típica de cazuela de barro con costilla, morcilla y garbanzos de la huerta.",
  prepTime: 20,
  cookTime: 45,
  servings: 4,
  difficulty: "MEDIA",
  imageUrl: null,
  region: "La Plana",
  familyStory: null,
  isPublished: true,
  createdAt: new Date(),
  updatedAt: new Date(),
  authorId: "user-1",
  author: {
    id: "user-1",
    name: "Cocinero Casero",
    image: null,
  },
  _count: {
    favorites: 3,
  },
};

export default function Home() {
  return (
    <main className="p-8 max-w-xl mx-auto space-y-6">
      <h1 className="font-serif text-4xl text-recuina-olive-800">
        Recuina
      </h1>
      <p className="text-recuina-text-secondary leading-relaxed">
        Comprobación visual de fuentes y paleta de colores. Si ves este texto con
        fondo cálido, título elegante con serifa y los botones coloreados, el setup
        de Tailwind está listo.
      </p>

      <div className="flex gap-4">
        <button className="bg-recuina-olive-600 hover:bg-recuina-olive-700 text-white px-5 py-2.5 rounded-pill font-medium transition-colors">
          Botón Oliva
        </button>
        <button className="bg-recuina-terracotta-500 hover:bg-recuina-terracotta-600 text-white px-5 py-2.5 rounded-pill font-medium transition-colors">
          Botón Terracota
        </button>
      </div>

      <div className="pt-4">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-[#6B665F] mb-3">
          Prueba de Componente RecipeCard:
        </h2>
        <RecipeCard recipe={mockRecipe} />
      </div>
    </main>
  );
}