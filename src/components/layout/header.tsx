import Link from "next/link";
import { auth } from "@/lib/auth";
import { LoginButton } from "@/components/auth/login-button";
import { LogoutButton } from "@/components/auth/logout-button";

export async function Header() {
  const session = await auth();

  return (
    <header className="border-b border-stone-200 bg-white/80 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logotipo y enlace principal */}
        <Link href="/" className="flex items-center gap-2 group">
          <span className="text-2xl font-serif font-bold text-amber-700 tracking-tight group-hover:text-amber-800 transition-colors">
            Recuina
          </span>
          <span className="text-xs bg-amber-100 text-amber-800 font-medium px-2 py-0.5 rounded-full">
            Tradicional
          </span>
        </Link>

        {/* Zona de autenticación / perfil */}
        <div className="flex items-center gap-4">
          {session?.user ? (
            <div className="flex items-center gap-3">
              {session.user.image ? (
                <img
                  src={session.user.image}
                  alt={session.user.name ?? "Avatar de usuario"}
                  className="w-8 h-8 rounded-full border border-stone-300 object-cover"
                />
              ) : (
                <div className="w-8 h-8 rounded-full bg-amber-100 text-amber-800 font-bold text-xs flex items-center justify-center border border-amber-300">
                  {session.user.name?.charAt(0).toUpperCase() ?? "U"}
                </div>
              )}
              <span className="text-sm font-medium text-stone-700 hidden sm:inline-block">
                {session.user.name ?? session.user.email}
              </span>
              <LogoutButton />
            </div>
          ) : (
            <LoginButton />
          )}
        </div>
      </div>
    </header>
  );
}