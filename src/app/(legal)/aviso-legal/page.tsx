import Link from "next/link";

export default function AvisoLegalPage() {
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
          Información regulatoria
        </p>
        <h1 className="font-serif text-3xl sm:text-4xl text-[#23211E]">
          Aviso Legal
        </h1>
        <p className="text-xs text-[#9E988F]">
          Última actualización: Noviembre 2026
        </p>
      </header>

      <div className="bg-white p-6 sm:p-8 rounded-2xl border border-[#E7E2DA] space-y-6 text-sm sm:text-base text-[#23211E]/90 leading-relaxed shadow-xs">
        <section className="space-y-2">
          <h2 className="font-serif text-xl text-[#23211E]">
            1. Información General (Art. 10 LSSI-CE)
          </h2>
          <p>
            En cumplimiento de lo dispuesto en la Ley 34/2002, de 11 de julio,
            de la Sociedad de la Información y de Comercio Electrónico
            (LSSI-CE), se informa de los datos identificativos del responsable
            del sitio web:
          </p>
          <ul className="list-disc pl-5 space-y-1 text-[#6B665F]">
            <li>
              <strong className="text-[#23211E]">Titular:</strong> Joaquín Peraire Monfort
            </li>
            <li>
              <strong className="text-[#23211E]">Sitio web:</strong> Recuina (https://www.recuina.com)
            </li>
            <li>
              <strong className="text-[#23211E]">Correo de contacto:</strong> x.peraire@gmail.com
            </li>
            <li>
              <strong className="text-[#23211E]">Actividad:</strong> Plataforma web comunitaria sin ánimo de lucro destinada al archivo, consulta y puesta en común de recetas de cocina caseras.
            </li>
          </ul>
        </section>

        <section className="space-y-2">
          <h2 className="font-serif text-xl text-[#23211E]">
            2. Condiciones de Uso
          </h2>
          <p>
            El acceso y uso de Recuina atribuye la condición de usuario,
            implicando la aceptación plena y sin reservas de las presentes
            condiciones. El usuario se compromete a hacer un uso lícito y
            diligente de la plataforma, absteniéndose de publicar recetas,
            imágenes o comentarios que infrinjan derechos de terceros, sean
            ofensivos o atenten contra las leyes vigentes. El titular se reserva
            el derecho de retirar de forma unilateral y sin previo aviso
            cualquier contenido, receta o comentario que incumpla las normas
            básicas de convivencia o la legalidad.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-serif text-xl text-[#23211E]">
            3. Propiedad Intelectual de los Contenidos
          </h2>
          <p>
            El código fuente, diseño gráfico, arquitectura y elementos técnicos
            de la plataforma son titularidad exclusiva de Joaquín Peraire
            Monfort. Al publicar una receta, fotografía o apunte culinario, el
            usuario manifiesta ser el autor legítimo o contar con los derechos
            necesarios, concediendo a Recuina una licencia no exclusiva,
            gratuita y de ámbito mundial para su exhibición pública dentro del
            catálogo del sitio web.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-serif text-xl text-[#23211E]">
            4. Exclusión de Responsabilidad
          </h2>
          <p>
            El titular no se hace responsable de posibles errores en las
            recetas publicadas, la idoneidad alimentaria de los ingredientes
            sugeridos, ni de posibles caídas temporales del servicio debidas a
            causas técnicas ajenas a su control (servicios de hosting o base de
            datos de terceros).
          </p>
        </section>
      </div>
    </article>
  );
}