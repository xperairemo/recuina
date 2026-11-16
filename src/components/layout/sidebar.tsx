"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutGrid, BookOpen, Bookmark, PlusCircle } from "lucide-react";

interface SidebarProps {
  isAuthenticated: boolean;
  myRecipesCount?: number;
  favoritesCount?: number;
}

export function Sidebar({
  isAuthenticated,
  myRecipesCount = 0,
  favoritesCount = 0,
}: SidebarProps) {
  const pathname = usePathname();

  const navItems = [
    {
      label: "Todas las recetas",
      href: "/",
      icon: LayoutGrid,
      public: true,
    },
    {
      label: "Mis recetas",
      href: "/mis-recetas",
      icon: BookOpen,
      count: myRecipesCount,
      public: false,
    },
    {
      label: "Favoritos",
      href: "/favoritos",
      icon: Bookmark,
      count: favoritesCount,
      public: false,
    },
    {
      label: "Añadir receta",
      href: "/recetas/nueva",
      icon: PlusCircle,
      public: false,
    },
  ];

  const visibleItems = navItems.filter((item) => item.public || isAuthenticated);

  return (
    <>
      {/* Navegación móvil horizontal */}
      <nav
        aria-label="Navegación móvil"
        className="lg:hidden border-b border-[#E7E2DA] bg-[#F4F0EB] px-4 py-2.5 flex items-center gap-2 overflow-x-auto"
      >
        {visibleItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-medium whitespace-nowrap transition-colors border ${
                isActive
                  ? "bg-[#E3EBE5] border-[#4A6B53]/30 text-[#2F4435] font-semibold"
                  : "bg-white/80 border-[#E7E2DA] text-[#6B665F] hover:text-[#23211E]"
              }`}
            >
              <Icon className="w-4 h-4 shrink-0" />
              <span>{item.label}</span>
              {typeof item.count === "number" && (
                <span className="text-[11px] opacity-75">({item.count})</span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Sidebar fija en escritorio (260px) */}
      <aside
        aria-label="Menú principal"
        className="hidden lg:flex flex-col w-[260px] shrink-0 border-r border-[#E7E2DA] bg-[#F4F0EB]/70 p-5"
      >
        <div className="sticky top-24 space-y-6">
          <div>
            <p className="px-2 mb-3 text-[11px] font-semibold uppercase tracking-wider text-[#9E988F]">
              Mi Recetario
            </p>

            <nav className="space-y-2.5">
              {visibleItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center justify-between px-4 py-3 rounded-2xl text-sm transition-all border ${
                      isActive
                        ? "bg-[#E3EBE5] border-[#4A6B53]/40 text-[#2F4435] font-semibold shadow-2xs"
                        : "bg-white/90 border-[#E7E2DA] text-[#6B665F] hover:bg-white hover:text-[#23211E] hover:border-stone-300"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon
                        className={`w-4 h-4 shrink-0 ${
                          isActive ? "text-[#4A6B53]" : "text-[#6B665F]"
                        }`}
                      />
                      <span>{item.label}</span>
                    </div>

                    {typeof item.count === "number" && (
                      <span
                        className={`text-xs font-medium ${
                          isActive ? "text-[#2F4435]" : "text-[#9E988F]"
                        }`}
                      >
                        {item.count}
                      </span>
                    )}
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>
      </aside>
    </>
  );
}