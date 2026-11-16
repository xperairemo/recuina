import Link from "next/link";
import Image from "next/image";
import { auth } from "@/lib/auth";
import { LoginButton } from "@/components/auth/login-button";
import { LogoutButton } from "@/components/auth/logout-button";

export async function Header() {
  const session = await auth();

  return (
    <header className="border-b border-[#E7E2DA] bg-[#FAF8F5]/90 backdrop-blur-md sticky top-0 z-50 w-full">
      <div className="w-full px-6 lg:px-8 h-18 py-3 flex items-center justify-between">
        {/* Izquierda: Logotipo */}
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-stone-200/60 border border-stone-300/80 flex items-center justify-center text-stone-700 text-lg">
              🍲
            </div>
            <span className="text-2xl sm:text-3xl font-serif font-medium text-[#23211E] tracking-tight">
              Recuina
            </span>
          </Link>
        </div>

        {/* Centro: Lema visual */}
        <div className="hidden md:block text-sm text-[#6B665F]">
          Tu cocina, en buena compañía.
        </div>

        {/* Derecha: Acciones y Perfil */}
        <div className="flex items-center gap-4">
          {session?.user ? (
            <div className="flex items-center gap-4">
              {/* Botón Añadir Receta */}
              <Link
                href="/recetas/nueva"
                className="hidden sm:inline-flex items-center gap-2 bg-[#2F4435] hover:bg-[#3D5844] text-white px-5 py-2.5 rounded-full text-sm font-medium transition-colors shadow-sm"
              >
                <span>+</span> Añadir receta
              </Link>

              {/* Tarjeta de Usuario */}
              <div className="flex items-center gap-3 pl-2 sm:border-l sm:border-[#E7E2DA]">
                {session.user.image ? (
                  <Image
                    src={session.user.image}
                    alt={session.user.name ?? "Avatar de usuario"}
                    width={36}
                    height={36}
                    referrerPolicy="no-referrer"
                    className="w-9 h-9 rounded-full border border-stone-300 object-cover"
                  />
                ) : (
                  <div className="w-9 h-9 rounded-full bg-stone-200 text-stone-700 font-semibold text-xs flex items-center justify-center border border-stone-300">
                    {session.user.name?.charAt(0).toUpperCase() ?? "U"}
                  </div>
                )}

                <div className="hidden md:flex flex-col text-left">
                  <span className="text-xs font-semibold text-[#23211E] leading-tight">
                    {session.user.name?.split(" ")[0] ?? "Mi cuenta"}
                  </span>
                  <span className="text-[11px] text-[#6B665F] leading-tight">
                    Mi cocina personal
                  </span>
                </div>

                <LogoutButton />
              </div>
            </div>
          ) : (
            <LoginButton />
          )}
        </div>
      </div>
    </header>
  );
}