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

      <div className="bg-recuina-card border border-recuina-border p-6 rounded-cozy shadow-sm">
        <span className="text-xs font-semibold uppercase tracking-wider text-recuina-olive-600">
          Tarjeta de prueba
        </span>
        <h2 className="font-serif text-xl text-recuina-text-primary mt-1">
          Calabaza asada con especias
        </h2>
        <p className="text-sm text-recuina-text-muted mt-2">
          Tiempo: 45 min · Dificultad: Fácil · Región: La Plana
        </p>
      </div>
    </main>
  );
}