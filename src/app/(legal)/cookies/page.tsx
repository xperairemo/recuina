import Link from "next/link";

export default function CookiesPage() {
  return (
    <article className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <nav>
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-[#6B665F] hover:text-[#23211E] transition-colors"
        >
          <span>←</span> Volver al recetario
        </Link>
      </nav>

      <header className="space-y-2 border-b border-[#E7E2DA] pb-6">
        <p className="text-xs font-semibold uppercase tracking-wider text-[#4A6B53]">
          Almacenamiento técnico
        </p>
        <h1 className="font-serif text-3xl sm:text-4xl text-[#23211E]">
          Política de Cookies
        </h1>
        <p className="text-xs text-[#9E988F]">
          Última actualización: Noviembre 2026
        </p>
      </header>

      <div className="bg-white p-6 sm:p-8 rounded-2xl border border-[#E7E2DA] space-y-6 text-sm sm:text-base text-[#23211E]/90 leading-relaxed shadow-xs">
        <section className="space-y-2">
          <h2 className="font-serif text-xl text-[#23211E]">
            1. ¿Qué son las cookies y cómo las usa Recuina?
          </h2>
          <p>
            Una cookie es un pequeño archivo de texto que el navegador almacena
            al visitar un sitio web. Recuina no utiliza cookies publicitarias,
            ni de seguimiento cruzado, ni píxeles comerciales de terceros.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-serif text-xl text-[#23211E]">
            2. Cookies Técnicas Utilizadas
          </h2>
          <div className="overflow-x-auto rounded-xl border border-[#E7E2DA]">
            <table className="w-full text-left text-xs sm:text-sm border-collapse">
              <thead className="bg-[#FAF8F5] text-[#23211E] border-b border-[#E7E2DA]">
                <tr>
                  <th className="py-3 px-4 font-semibold">Nombre</th>
                  <th className="py-3 px-4 font-semibold">Tipo</th>
                  <th className="py-3 px-4 font-semibold">Finalidad</th>
                  <th className="py-3 px-4 font-semibold">Duración</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E7E2DA] text-[#6B665F]">
                <tr>
                  <td className="py-3 px-4 font-mono text-xs text-[#23211E]">
                    authjs.session-token
                  </td>
                  <td className="py-3 px-4">Técnica / Necesaria</td>
                  <td className="py-3 px-4">
                    Mantiene la sesión iniciada mediante token seguro cifrado HttpOnly.
                  </td>
                  <td className="py-3 px-4">Sesión / 30 días</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-mono text-xs text-[#23211E]">
                    authjs.csrf-token
                  </td>
                  <td className="py-3 px-4">Técnica / Necesaria</td>
                  <td className="py-3 px-4">
                    Previene ataques de falsificación de petición en sitios cruzados (CSRF).
                  </td>
                  <td className="py-3 px-4">Sesión</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-mono text-xs text-[#23211E]">
                    authjs.callback-url
                  </td>
                  <td className="py-3 px-4">Técnica</td>
                  <td className="py-3 px-4">
                    Redirige al usuario a la página de origen tras completar el login con Google.
                  </td>
                  <td className="py-3 px-4">Sesión</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <section className="space-y-2">
          <h2 className="font-serif text-xl text-[#23211E]">
            3. Exención de Consentimiento (Banner de Cookies)
          </h2>
          <p>
            De acuerdo con el artículo 22.2 de la LSSI-CE y las directrices de
            la AEPD y el Comité Europeo de Protección de Datos (CEPD), las
            cookies estrictamente técnicas requeridas exclusivamente para
            permitir la navegación o prestar un servicio expresamente solicitado
            por el usuario (como mantener la sesión iniciada) están exentas del
            requisito de consentimiento previo. Por ello, Recuina prescinde de
            banners invasivos.
          </p>
        </section>
      </div>
    </article>
  );
}