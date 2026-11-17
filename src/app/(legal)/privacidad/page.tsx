import Link from "next/link";

export default function PrivacidadPage() {
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
          Protección de datos
        </p>
        <h1 className="font-serif text-3xl sm:text-4xl text-[#23211E]">
          Política de Privacidad
        </h1>
        <p className="text-xs text-[#9E988F]">
          Última actualización: Noviembre 2026
        </p>
      </header>

      <div className="bg-white p-6 sm:p-8 rounded-2xl border border-[#E7E2DA] space-y-6 text-sm sm:text-base text-[#23211E]/90 leading-relaxed shadow-xs">
        <p>
          En Recuina nos tomamos muy en serio la protección de tus datos
          personales, cumpliendo con el Reglamento General de Protección de
          Datos (RGPD UE 2016/679) y la Ley Orgánica 3/2018 (LOPDGDD).
        </p>

        <section className="space-y-2">
          <h2 className="font-serif text-xl text-[#23211E]">
            1. Responsable del Tratamiento
          </h2>
          <p className="text-[#6B665F]">
            <strong className="text-[#23211E]">Identidad:</strong> Joaquín Peraire Monfort ·{" "}
            <strong className="text-[#23211E]">Contacto para privacidad:</strong> x.peraire@gmail.com
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-serif text-xl text-[#23211E]">
            2. Datos que recopilamos y finalidad
          </h2>
          <p>
            Recuina aplica el principio de minimización de datos. Solo
            recopilamos los datos estrictamente necesarios para el
            funcionamiento de la cuenta:
          </p>
          <ul className="list-disc pl-5 space-y-2 text-[#6B665F]">
            <li>
              <strong className="text-[#23211E]">Autenticación con Google (OAuth 2.0):</strong> Nombre, dirección de correo electrónico y avatar público facilitados por tu cuenta de Google. Finalidad: Identificación de sesión, asignación de autoría en recetas creadas y personalización de tu lista de favoritos. Base jurídica: Consentimiento explícito del usuario al pulsar «Iniciar sesión con Google» (Art. 6.1.a RGPD) y ejecución de la relación de uso del servicio (Art. 6.1.b RGPD).
            </li>
            <li>
              <strong className="text-[#23211E]">Contenido aportado:</strong> Títulos, ingredientes, pasos, región, imágenes y comentarios añadidos por el usuario. Finalidad: Publicación dentro del recetario según las funciones de la plataforma.
            </li>
          </ul>
        </section>

        <section className="space-y-2">
          <h2 className="font-serif text-xl text-[#23211E]">
            3. Destinatarios y Encargados del Tratamiento
          </h2>
          <p>
            Tus datos no se venden ni ceden a terceros con fines comerciales.
            Utilizamos proveedores tecnológicos con garantías adecuadas de
            seguridad: Vercel Inc. (alojamiento y ejecución Next.js), Supabase
            Inc. (base de datos PostgreSQL gestionada y almacenamiento de
            imágenes) y Google LLC (autenticación federada OAuth 2.0).
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-serif text-xl text-[#23211E]">
            4. Plazo de Conservación
          </h2>
          <p>
            Los datos de perfil y el contenido asociado se mantendrán activos
            mientras el usuario conserve su cuenta en Recuina. Si el usuario
            solicita la eliminación de su cuenta, se borrarán todos sus datos
            personales, recetas y comentarios asociados en cascada.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-serif text-xl text-[#23211E]">
            5. Ejercicio de Derechos (ARCO+)
          </h2>
          <p>
            Cualquier usuario puede ejercer en cualquier momento sus derechos de
            acceso, rectificación, supresión, limitación del tratamiento,
            portabilidad y oposición enviando un correo electrónico a{" "}
            <strong className="text-[#23211E]">x.peraire@gmail.com</strong>.
            Asimismo, tiene derecho a presentar una reclamación ante la Agencia
            Española de Protección de Datos (AEPD) si considera vulnerados sus
            derechos.
          </p>
        </section>
      </div>
    </article>
  );
}