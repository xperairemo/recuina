"use client";

import { useState, useTransition, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  createRecipeAction,
  uploadRecipeImageAction,
} from "@/server/actions/recipe.actions";
import { RecipeInput } from "@/lib/validations/recipe";

type FormErrors = Record<string, string[]>;

export function RecipeForm() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isPending, startTransition] = useTransition();
  const [formError, setFormError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<FormErrors>({});

  // Estados de campos base
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [prepTime, setPrepTime] = useState<number | "">("");
  const [cookTime, setCookTime] = useState<number | "">("");
  const [servings, setServings] = useState<number | "">(4);
  const [difficulty, setDifficulty] = useState<"FACIL" | "MEDIA" | "DIFICIL">("FACIL");
  const [region, setRegion] = useState("");
  const [familyStory, setFamilyStory] = useState("");

  // Estados para la imagen
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [imageError, setImageError] = useState<string | null>(null);

  // Arrays dinámicos
  const [ingredients, setIngredients] = useState<
    Array<{ name: string; quantity: string; unit: string }>
  >([{ name: "", quantity: "", unit: "" }]);

  const [steps, setSteps] = useState<Array<{ instruction: string }>>([
    { instruction: "" },
  ]);

  // Manejo de selección de imagen
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setImageError(null);
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      setImageError("La imagen supera el límite de 2 MB.");
      return;
    }

    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
      setImageError("Formato no compatible. Elige JPG, PNG o WebP.");
      return;
    }

    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const handleRemoveImage = () => {
    setSelectedFile(null);
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Manejadores de ingredientes
  const handleAddIngredient = () => {
    setIngredients([...ingredients, { name: "", quantity: "", unit: "" }]);
  };

  const handleRemoveIngredient = (indexToRemove: number) => {
    if (ingredients.length === 1) return;
    setIngredients(ingredients.filter((_, idx) => idx !== indexToRemove));
  };

  const handleIngredientChange = (
    index: number,
    field: "name" | "quantity" | "unit",
    value: string
  ) => {
    const updated = [...ingredients];
    updated[index][field] = value;
    setIngredients(updated);
  };

  // Manejadores de pasos
  const handleAddStep = () => {
    setSteps([...steps, { instruction: "" }]);
  };

  const handleRemoveStep = (indexToRemove: number) => {
    if (steps.length === 1) return;
    setSteps(steps.filter((_, idx) => idx !== indexToRemove));
  };

  const handleStepChange = (index: number, value: string) => {
    const updated = [...steps];
    updated[index].instruction = value;
    setSteps(updated);
  };

  // Envío del formulario
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    setFieldErrors({});

    startTransition(async () => {
      let finalImageUrl: string | null = null;

      // Si el usuario adjuntó una fotografía, la subimos primero a Storage
      if (selectedFile) {
        const formData = new FormData();
        formData.append("image", selectedFile);

        const uploadRes = await uploadRecipeImageAction(formData);
        if (!uploadRes.success || !uploadRes.data?.imageUrl) {
          setFormError(uploadRes.message || "No se pudo subir la fotografía.");
          return;
        }

        finalImageUrl = uploadRes.data.imageUrl;
      }

      // Preparar payload de receta
      const payload: RecipeInput = {
        title,
        description,
        prepTime: Number(prepTime),
        cookTime: cookTime === "" ? null : Number(cookTime),
        servings: Number(servings),
        difficulty,
        region: region || null,
        familyStory: familyStory || null,
        imageUrl: finalImageUrl,
        isPublished: true,
        ingredients: ingredients.map((ing, idx) => ({
          name: ing.name,
          quantity: ing.quantity === "" ? null : Number(ing.quantity),
          unit: ing.unit || null,
          order: idx + 1,
        })),
        steps: steps.map((st, idx) => ({
          instruction: st.instruction,
          order: idx + 1,
        })),
      };

      const response = await createRecipeAction(payload);

      if (!response.success) {
        setFormError(response.message || "Error al guardar la receta.");
        if (response.errors) {
          setFieldErrors(response.errors);
        }
        return;
      }

      router.push("/");
      router.refresh();
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {formError && (
        <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-sm text-red-700">
          {formError}
        </div>
      )}

      {/* Bloque 1: Información General y Fotografía */}
      <section className="bg-white p-6 sm:p-8 rounded-2xl border border-stone-200 space-y-6 shadow-sm">
        <h2 className="font-serif text-xl text-stone-900 border-b border-stone-100 pb-3">
          Información general
        </h2>

        <div className="space-y-4">
          {/* Subida de Fotografía */}
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1">
              Fotografía de la receta (Opcional)
            </label>
            <div className="mt-1 flex items-center gap-4">
              {previewUrl ? (
                <div className="relative w-36 h-28 rounded-xl overflow-hidden border border-stone-200 bg-stone-100 shrink-0">
                  <img
                    src={previewUrl}
                    alt="Previsualización"
                    className="w-full h-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={handleRemoveImage}
                    className="absolute top-1 right-1 w-6 h-6 rounded-full bg-stone-900/70 text-white text-xs flex items-center justify-center hover:bg-red-600 transition-colors"
                    title="Quitar foto"
                  >
                    ✕
                  </button>
                </div>
              ) : (
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="w-36 h-28 rounded-xl border-2 border-dashed border-stone-300 hover:border-stone-400 bg-stone-50 flex flex-col items-center justify-center cursor-pointer transition-colors shrink-0 text-stone-400 hover:text-stone-600"
                >
                  <span className="text-2xl">📷</span>
                  <span className="text-[11px] mt-1 font-medium">Subir foto</span>
                </div>
              )}

              <div className="text-xs text-stone-500 space-y-1">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={handleImageChange}
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="px-3.5 py-1.5 rounded-full border border-stone-300 text-stone-700 font-medium hover:bg-stone-50 transition-colors text-xs"
                >
                  Seleccionar archivo
                </button>
                <p>JPG, PNG o WebP. Máximo 2 MB.</p>
                {imageError && (
                  <p className="text-red-600 font-medium">{imageError}</p>
                )}
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1">
              Título de la receta *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ej. Arroz caldoso con bogavante"
              className="w-full px-4 py-2.5 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-stone-900/10 focus:border-stone-800 text-sm"
            />
            {fieldErrors.title && (
              <p className="mt-1 text-xs text-red-600">{fieldErrors.title[0]}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1">
              Descripción breve *
            </label>
            <textarea
              required
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Resume de qué trata el plato, su textura o sabor característico..."
              className="w-full px-4 py-2.5 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-stone-900/10 focus:border-stone-800 text-sm"
            />
            {fieldErrors.description && (
              <p className="mt-1 text-xs text-red-600">{fieldErrors.description[0]}</p>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1">
                Prep. (minutos) *
              </label>
              <input
                type="number"
                min={1}
                required
                value={prepTime}
                onChange={(e) =>
                  setPrepTime(e.target.value === "" ? "" : Number(e.target.value))
                }
                placeholder="20"
                className="w-full px-4 py-2 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-stone-900/10 focus:border-stone-800 text-sm"
              />
              {fieldErrors.prepTime && (
                <p className="mt-1 text-xs text-red-600">{fieldErrors.prepTime[0]}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1">
                Cocinado (minutos)
              </label>
              <input
                type="number"
                min={0}
                value={cookTime}
                onChange={(e) =>
                  setCookTime(e.target.value === "" ? "" : Number(e.target.value))
                }
                placeholder="45"
                className="w-full px-4 py-2 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-stone-900/10 focus:border-stone-800 text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1">
                Raciones *
              </label>
              <input
                type="number"
                min={1}
                required
                value={servings}
                onChange={(e) =>
                  setServings(e.target.value === "" ? "" : Number(e.target.value))
                }
                className="w-full px-4 py-2 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-stone-900/10 focus:border-stone-800 text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1">
                Dificultad *
              </label>
              <select
                value={difficulty}
                onChange={(e) =>
                  setDifficulty(e.target.value as "FACIL" | "MEDIA" | "DIFICIL")
                }
                className="w-full px-4 py-2 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-stone-900/10 focus:border-stone-800 text-sm bg-white"
              >
                <option value="FACIL">Fácil</option>
                <option value="MEDIA">Media</option>
                <option value="DIFICIL">Difícil</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1">
                Región o Comarca
              </label>
              <input
                type="text"
                value={region}
                onChange={(e) => setRegion(e.target.value)}
                placeholder="Ej. Els Ports, La Plana, L'Alcoià..."
                className="w-full px-4 py-2.5 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-stone-900/10 focus:border-stone-800 text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1">
                Historia o apunte familiar
              </label>
              <input
                type="text"
                value={familyStory}
                onChange={(e) => setFamilyStory(e.target.value)}
                placeholder="Ej. Receta de la abuela María para domingos..."
                className="w-full px-4 py-2.5 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-stone-900/10 focus:border-stone-800 text-sm"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Bloque 2: Ingredientes */}
      <section className="bg-white p-6 sm:p-8 rounded-2xl border border-stone-200 space-y-6 shadow-sm">
        <div className="flex items-center justify-between border-b border-stone-100 pb-3">
          <h2 className="font-serif text-xl text-stone-900">Ingredientes</h2>
          <button
            type="button"
            onClick={handleAddIngredient}
            className="text-xs font-semibold px-3 py-1.5 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-800 transition-colors"
          >
            + Añadir ingrediente
          </button>
        </div>

        {fieldErrors.ingredients && (
          <p className="text-xs text-red-600">{fieldErrors.ingredients[0]}</p>
        )}

        <div className="space-y-3">
          {ingredients.map((ing, idx) => (
            <div key={idx} className="flex gap-2 items-center">
              <input
                type="text"
                required
                value={ing.name}
                onChange={(e) =>
                  handleIngredientChange(idx, "name", e.target.value)
                }
                placeholder="Ingrediente (ej. Tomate triturado)"
                className="flex-1 px-4 py-2 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-stone-900/10 focus:border-stone-800 text-sm"
              />
              <input
                type="number"
                step="any"
                min={0}
                value={ing.quantity}
                onChange={(e) =>
                  handleIngredientChange(idx, "quantity", e.target.value)
                }
                placeholder="Cant."
                className="w-24 px-3 py-2 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-stone-900/10 focus:border-stone-800 text-sm text-center"
              />
              <input
                type="text"
                value={ing.unit}
                onChange={(e) =>
                  handleIngredientChange(idx, "unit", e.target.value)
                }
                placeholder="Unidad (g, ml)"
                className="w-28 px-3 py-2 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-stone-900/10 focus:border-stone-800 text-sm"
              />
              <button
                type="button"
                onClick={() => handleRemoveIngredient(idx)}
                disabled={ingredients.length === 1}
                className="p-2 text-stone-400 hover:text-red-600 disabled:opacity-30 disabled:hover:text-stone-400 transition-colors"
                title="Eliminar ingrediente"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Bloque 3: Pasos de Elaboración */}
      <section className="bg-white p-6 sm:p-8 rounded-2xl border border-stone-200 space-y-6 shadow-sm">
        <div className="flex items-center justify-between border-b border-stone-100 pb-3">
          <h2 className="font-serif text-xl text-stone-900">
            Pasos de elaboración
          </h2>
          <button
            type="button"
            onClick={handleAddStep}
            className="text-xs font-semibold px-3 py-1.5 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-800 transition-colors"
          >
            + Añadir paso
          </button>
        </div>

        {fieldErrors.steps && (
          <p className="text-xs text-red-600">{fieldErrors.steps[0]}</p>
        )}

        <div className="space-y-4">
          {steps.map((st, idx) => (
            <div key={idx} className="flex gap-3 items-start">
              <span className="w-8 h-8 rounded-full bg-stone-100 text-stone-700 font-semibold text-xs flex items-center justify-center shrink-0 mt-1">
                {idx + 1}
              </span>
              <textarea
                required
                rows={2}
                value={st.instruction}
                onChange={(e) => handleStepChange(idx, e.target.value)}
                placeholder={`Describe qué hacer en el paso ${idx + 1}...`}
                className="flex-1 px-4 py-2 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-stone-900/10 focus:border-stone-800 text-sm"
              />
              <button
                type="button"
                onClick={() => handleRemoveStep(idx)}
                disabled={steps.length === 1}
                className="p-2 text-stone-400 hover:text-red-600 disabled:opacity-30 disabled:hover:text-stone-400 transition-colors mt-1"
                title="Eliminar paso"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Botones de Acción */}
      <div className="flex items-center justify-end gap-4 pt-2">
        <Link
          href="/"
          className="px-6 py-2.5 rounded-full border border-stone-300 text-stone-700 text-sm font-medium hover:bg-stone-50 transition-colors"
        >
          Cancelar
        </Link>
        <button
          type="submit"
          disabled={isPending}
          className="px-8 py-2.5 rounded-full bg-[#2F4435] hover:bg-[#3D5844] text-white text-sm font-medium transition-colors shadow-sm disabled:opacity-50"
        >
          {isPending ? "Guardando receta e imagen..." : "Publicar receta"}
        </button>
      </div>
    </form>
  );
}