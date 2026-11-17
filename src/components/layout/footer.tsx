import Link from "next/link";
import { Coffee } from "lucide-react";

export function Footer() {
  return (
    <footer className="mt-16 border-t border-[#E7E2DA] bg-[#F4F0EB]/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col md:flex-row items-center justify-between gap-6">
        {/* Firma de autoría */}
        <div className="text-center md:text-left space-y-1">
          <p className="font-serif text-sm font-medium text-[#23211E]">
            Recuina
          </p>
          <p className="text-xs text-[#6B665F]">
            Desarrollado con dedicación por Joaquín Peraire Monfort — Homenaje a la cocina familiar
          </p>
        </div>

        {/* Módulo de micro-mecenazgo voluntario */}
        <a
          href="https://paypal.me/PeraireMonfort"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white hover:bg-[#FDF6F3] text-[#23211E] border border-[#E7E2DA] hover:border-[#C86D51]/40 text-xs font-medium transition-colors shadow-xs"
        >
          <Coffee className="w-4 h-4 text-[#C86D51]" />
          <span>¿Te gusta Recuina? Invítame a un café</span>
        </a>

        {/* Enlaces legales obligatorios */}
        <nav
          aria-label="Enlaces legales"
          className="flex flex-wrap items-center justify-center gap-4 text-xs text-[#6B665F]"
        >
          <Link
            href="/aviso-legal"
            className="hover:text-[#23211E] transition-colors"
          >
            Aviso legal
          </Link>
          <span className="text-[#E7E2DA]">•</span>
          <Link
            href="/privacidad"
            className="hover:text-[#23211E] transition-colors"
          >
            Privacidad
          </Link>
          <span className="text-[#E7E2DA]">•</span>
          <Link
            href="/cookies"
            className="hover:text-[#23211E] transition-colors"
          >
            Cookies
          </Link>
        </nav>
      </div>
    </footer>
  );
}