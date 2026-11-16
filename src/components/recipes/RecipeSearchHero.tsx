"use client";

import { useState, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search, Clock, ChefHat, MapPin, X, Plus, Check } from "lucide-react";

interface RecipeSearchHeroProps {
  userName?: string | null;
  availableRegions: string[];
}

const QUICK_INGREDIENTS = [
  "Patata",
  "Arroz",
  "Huevo",
  "Pollo",
  "Calabaza",
  "Tomate",
  "Garbanzos",
];

export function RecipeSearchHero({
  userName,
  availableRegions,
}: RecipeSearchHeroProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  // Estado inicial sincronizado con la URL
  const [searchText, setSearchText] = useState(searchParams.get("search") ?? "");
  const selectedIngredients = searchParams.get("ingredients")
    ? searchParams.get("ingredients")!.split(",").filter(Boolean)
    : [];
  const selectedDifficulty = searchParams.get("difficulty") ?? "";
  const selectedRegion = searchParams.get("region") ?? "";
  const selectedMaxTime = searchParams.get("maxTime") ?? "";

  const firstName = userName?.trim().split(" ")[0];

  const updateUrlParams = (updates: Record<string, string | null>) => {
    const params = new URLSearchParams(searchParams.toString());

    Object.entries(updates).forEach(([key, value]) => {
      if (value && value.trim() !== "") {
        params.set(key, value);
      } else {
        params.delete(key);
      }
    });

    const queryString = params.toString();
    startTransition(() => {
      router.replace(queryString ? `/?${queryString}` : "/", { scroll: false });
    });
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateUrlParams({ search: searchText });
  };

  const toggleIngredient = (ingredient: string) => {
    const exists = selectedIngredients.includes(ingredient);
    const updated = exists
      ? selectedIngredients.filter((item) => item !== ingredient)
      : [...selectedIngredients, ingredient];

    updateUrlParams({
      ingredients: updated.length > 0 ? updated.join(",") : null,
    });
  };

  const clearAllFilters = () => {
    setSearchText("");
    startTransition(() => {
      router.replace("/", { scroll: false });
    });
  };

  const hasActiveFilters = Boolean(
    searchParams.get("search") ||
      selectedIngredients.length > 0 ||
      selectedDifficulty ||
      selectedRegion ||
      selectedMaxTime
  );

  return (
    <section aria-label="Buscador y filtros de recetas" className="space-y-6">
      {/* Saludo superior */}
      <div className="space-y-2">
        <p className="text-[11px] font-semibold uppercase tracking-widest text-[#6B665F]">
          Un ratito para cocinar bien
        </p>
        <h1 className="font-serif text-3xl sm:text-5xl text-[#23211E] tracking-tight">
          {firstName
            ? `¿Qué te apetece cocinar, ${firstName}?`
            : "¿Qué te apetece cocinar hoy?"}
        </h1>
        <p className="text-[#6B665F] text-sm sm:text-base">
          Tus recetas de siempre y nuevas ideas para llevar a la mesa.
        </p>
      </div>

      {/* Caja de búsqueda verde estilo Figma */}
      <div className="rounded-3xl bg-[#E3EBE5]/75 border border-[#4A6B53]/30 p-4 sm:p-5 space-y-4 shadow-2xs">
        <form
          onSubmit={handleSearchSubmit}
          className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 bg-white rounded-2xl p-2 border border-[#E7E2DA] shadow-2xs"
        >
          <div className="flex items-center gap-3 flex-1 px-3 py-1.5">
            <Search className="w-5 h-5 text-[#9E988F] shrink-0" />
            <input
              type="text"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              placeholder="Busca una receta, un ingrediente o lo que tengas en la nevera..."
              className="w-full bg-transparent text-sm text-[#23211E] placeholder:text-[#9E988F] focus:outline-none"
            />
            {searchText && (
              <button
                type="button"
                onClick={() => {
                  setSearchText("");
                  updateUrlParams({ search: null });
                }}
                aria-label="Borrar búsqueda"
                className="text-[#9E988F] hover:text-[#23211E]"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          <button
            type="submit"
            disabled={isPending}
            className="bg-[#2F4435] hover:bg-[#3D5844] disabled:opacity-60 text-white text-sm font-medium px-6 py-2.5 rounded-xl transition-colors cursor-pointer"
          >
            {isPending ? "Buscando..." : "Buscar recetas"}
          </button>
        </form>

        {/* Chips rápidos: ¿Qué tienes a mano? */}
        <div className="flex flex-wrap items-center gap-2 px-1">
          <span className="text-xs font-medium text-[#6B665F] mr-1">
            ¿Qué tienes a mano?
          </span>

          {QUICK_INGREDIENTS.map((ingredient) => {
            const isSelected = selectedIngredients.includes(ingredient);

            return (
              <button
                key={ingredient}
                type="button"
                onClick={() => toggleIngredient(ingredient)}
                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium transition-all cursor-pointer border ${
                  isSelected
                    ? "bg-[#4A6B53] border-[#4A6B53] text-white shadow-2xs"
                    : "bg-white/95 border-[#E7E2DA] text-[#23211E] hover:border-[#4A6B53]/50"
                }`}
              >
                <span>{ingredient}</span>
                {isSelected ? (
                  <Check className="w-3 h-3" />
                ) : (
                  <Plus className="w-3 h-3 text-[#6B665F]" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Barra de filtros secundarios */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Filtro Tiempo */}
          <div className="relative inline-flex items-center">
            <Clock className="w-4 h-4 text-[#6B665F] absolute left-3.5 pointer-events-none" />
            <select
              aria-label="Filtrar por tiempo máximo"
              value={selectedMaxTime}
              onChange={(e) => updateUrlParams({ maxTime: e.target.value })}
              className={`appearance-none pl-9 pr-8 py-2 rounded-xl text-xs font-medium border transition-colors cursor-pointer focus:outline-none ${
                selectedMaxTime
                  ? "bg-[#E3EBE5] border-[#4A6B53]/40 text-[#2F4435]"
                  : "bg-white border-[#E7E2DA] text-[#23211E] hover:border-stone-300"
              }`}
            >
              <option value="">Tiempo</option>
              <option value="20">Hasta 20 min</option>
              <option value="45">Hasta 45 min</option>
              <option value="90">Hasta 90 min</option>
            </select>
          </div>

          {/* Filtro Dificultad */}
          <div className="relative inline-flex items-center">
            <ChefHat className="w-4 h-4 text-[#6B665F] absolute left-3.5 pointer-events-none" />
            <select
              aria-label="Filtrar por dificultad"
              value={selectedDifficulty}
              onChange={(e) => updateUrlParams({ difficulty: e.target.value })}
              className={`appearance-none pl-9 pr-8 py-2 rounded-xl text-xs font-medium border transition-colors cursor-pointer focus:outline-none ${
                selectedDifficulty
                  ? "bg-[#E3EBE5] border-[#4A6B53]/40 text-[#2F4435]"
                  : "bg-white border-[#E7E2DA] text-[#23211E] hover:border-stone-300"
              }`}
            >
              <option value="">Dificultad</option>
              <option value="FACIL">Fácil</option>
              <option value="MEDIA">Media</option>
              <option value="DIFICIL">Difícil</option>
            </select>
          </div>

          {/* Filtro Región */}
          <div className="relative inline-flex items-center">
            <MapPin className="w-4 h-4 text-[#6B665F] absolute left-3.5 pointer-events-none" />
            <select
              aria-label="Filtrar por región"
              value={selectedRegion}
              onChange={(e) => updateUrlParams({ region: e.target.value })}
              className={`appearance-none pl-9 pr-8 py-2 rounded-xl text-xs font-medium border transition-colors cursor-pointer focus:outline-none ${
                selectedRegion
                  ? "bg-[#E3EBE5] border-[#4A6B53]/40 text-[#2F4435]"
                  : "bg-white border-[#E7E2DA] text-[#23211E] hover:border-stone-300"
              }`}
            >
              <option value="">Región</option>
              {availableRegions.map((region) => (
                <option key={region} value={region}>
                  {region}
                </option>
              ))}
            </select>
          </div>

          {hasActiveFilters && (
            <button
              type="button"
              onClick={clearAllFilters}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium text-[#C86D51] hover:bg-[#C86D51]/10 transition-colors cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
              Limpiar filtros
            </button>
          )}
        </div>

        <p className="hidden xl:block text-xs text-[#9E988F]">
          Pequeñas ideas, grandes sobremesas.
        </p>
      </div>
    </section>
  );
}