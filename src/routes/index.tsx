import { useEffect, useMemo, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Apple, ArrowRight, Github, Instagram, Laptop, MousePointerClick, Shield, Sparkles, Twitter, Upload } from "lucide-react";
import { Toaster } from "@/components/ui/sonner";
import { Button } from "@/components/ui/button";
import { MacSurface } from "@/components/mac/MacSurface";
import { ClaimDialog } from "@/components/mac/ClaimDialog";
import { LiveTicker } from "@/components/mac/LiveTicker";
import { GOAL, SPOTS, currency, type Spot, type SpotView } from "@/lib/spots";
import { subscribeToSpots } from "@/lib/spots-service";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Tu Logo en mi Mac — Tu marca en la MacBook de un fundador" },
      {
        name: "description",
        content:
          "Consigue un espacio exclusivo para tu logo en una MacBook Pro en Santo Domingo. Espacios en la tapa exterior y teclado desde RD$1,000.",
      },
      { property: "og:title", content: "Tu Logo en mi Mac — Tu marca en la MacBook de un fundador" },
      {
        property: "og:description",
        content:
          "Espacios de stickers para empresas y proyectos tech en República Dominicana. Desde RD$1,000.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  const [spots, setSpots] = useState<Spot[]>(SPOTS);
  const [view, setView] = useState<SpotView>("lid");
  const [selected, setSelected] = useState<Spot | null>(null);

  useEffect(() => {
    const unsub = subscribeToSpots((liveSpots) => {
      setSpots(liveSpots);
    });
    return () => {
      if (typeof unsub === "function") unsub();
    };
  }, []);

  const raised = useMemo(
    () => spots.filter((s) => s.brand).reduce((sum, s) => sum + s.price, 0),
    [spots],
  );
  const available = spots.filter((s) => !s.brand);
  const cheapest = available.length > 0 ? Math.min(...available.map((s) => s.price)) : 1000;
  const pct = Math.round((raised / GOAL) * 100);

  const handleClaimSuccess = (spot: Spot, brandName: string) => {
    // Si se envía la solicitud, podemos actualizar la UI optimista si se requiere
    // El ClaimDialog ya guarda la solicitud en Firestore / LocalStorage
  };

  return (
    <div className="min-h-screen bg-background">
      <Toaster />
      <LiveTicker />

      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur">
        <div className="mx-auto grid max-w-6xl grid-cols-[minmax(0,1fr)_auto] items-center gap-4 px-5 py-3 sm:flex sm:justify-between">
          <a href="#top" className="flex min-w-0 items-center gap-2">
            <Laptop className="h-5 w-5 shrink-0 text-primary" />
            <span className="truncate text-sm font-semibold tracking-tight">Tu Logo en mi Mac</span>
          </a>
          <nav className="hidden items-center gap-7 text-sm text-muted-foreground md:flex">
            <a href="#surface" className="hover:text-foreground transition-colors">La MacBook</a>
            <a href="#pricing" className="hover:text-foreground transition-colors">Precios</a>
            <a href="#how" className="hover:text-foreground transition-colors">¿Cómo funciona?</a>
          </nav>
          <div className="flex items-center gap-3">
            <Button size="sm" asChild>
              <a href="#surface">Elegir espacio</a>
            </Button>
          </div>
        </div>
      </header>

      <main id="top">
        {/* Hero */}
        <section className="mx-auto max-w-3xl px-5 pb-10 pt-16 text-center sm:pt-24">
          <p className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-xs text-muted-foreground shadow-sm">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
            {available.length} espacios disponibles · Santo Domingo, RD
          </p>
          <h1 className="text-5xl font-semibold leading-[1.05] tracking-tight sm:text-7xl">
            Tu marca, en mi Mac.
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-base text-muted-foreground sm:text-lg">
            Tu logo viaja conmigo en la herramienta de trabajo más visible de un creador: una MacBook Pro que visita cafés, eventos tech, coworkings y reuniones a diario.
          </p>

          <div className="mx-auto mt-10 max-w-lg">
            <div className="flex items-baseline justify-between">
              <span className="font-mono text-3xl font-semibold">{currency(raised)}</span>
              <span className="text-sm text-muted-foreground">
                {pct >= 100 ? `¡Meta superada! (${pct}%)` : `${pct}% de la meta`}
              </span>
            </div>
            <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-secondary">
              <div
                className="h-full rounded-full bg-foreground transition-all duration-700"
                style={{ width: `${Math.min(pct, 100)}%` }}
              />
            </div>
            <p className="mt-3 text-sm text-muted-foreground">
              recaudado · Espacios desde {currency(cheapest)} · {available.length} libres de 18
            </p>
          </div>
        </section>

        {/* Surface */}
        <section id="surface" className="mx-auto max-w-4xl px-5 pb-20">
          <div className="mb-6 flex justify-center">
            <div className="inline-flex rounded-full border border-border bg-card p-1 shadow-sm">
              {(["lid", "inside"] as SpotView[]).map((v) => (
                <button
                  key={v}
                  onClick={() => setView(v)}
                  className={cn(
                    "rounded-full px-5 py-1.5 text-sm font-medium transition",
                    view === v ? "bg-foreground text-background" : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  {v === "lid" ? "Tapa exterior" : "Interior / Teclado"}
                </button>
              ))}
            </div>
          </div>

          <MacSurface view={view} spots={spots} onSelect={setSelected} onViewChange={setView} />
        </section>

        {/* Statement */}
        <section className="bg-ink py-24 text-ink-foreground">
          <div className="mx-auto max-w-3xl px-5 text-center">
            <Apple className="mx-auto mb-8 h-8 w-8 fill-current opacity-75" />
            <h2 className="text-4xl font-semibold leading-tight sm:text-5xl">
              Todos reconocen la manzana de Apple.
              <span className="block opacity-50 mt-2">Pon tu marca justo al lado de ella.</span>
            </h2>
          </div>
        </section>

        {/* Pricing */}
        <section id="pricing" className="mx-auto max-w-5xl px-5 py-24">
          <h2 className="text-3xl font-semibold sm:text-4xl">Todos los espacios y precios</h2>
          <p className="mt-2 text-muted-foreground">
            Espacios pequeños desde RD$1,000 · Medianos desde RD$1,800 · Grandes desde RD$3,800. Ubicaciones privilegiadas en la tapa y el teclado.
          </p>

          <div className="mt-8 overflow-hidden rounded-2xl border border-border">
            <table className="w-full text-left text-sm">
              <thead className="bg-secondary text-xs uppercase tracking-wide text-muted-foreground">
                <tr>
                  <th className="px-4 py-3 font-medium">Espacio</th>
                  <th className="hidden px-4 py-3 font-medium sm:table-cell">Medidas</th>
                  <th className="px-4 py-3 font-medium">Estado</th>
                  <th className="px-4 py-3 text-right font-medium">Precio</th>
                  <th className="px-4 py-3 text-right font-medium">Acción</th>
                </tr>
              </thead>
              <tbody>
                {spots.map((spot) => (
                  <tr key={spot.id} className="border-t border-border hover:bg-secondary/30 transition-colors">
                    <td className="px-4 py-3">
                      <div className="min-w-0">
                        <p className="truncate font-medium">{spot.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {spot.view === "lid" ? "Tapa exterior" : "Interior"}
                        </p>
                      </div>
                    </td>
                    <td className="hidden px-4 py-3 text-muted-foreground sm:table-cell">
                      {spot.size} · {spot.dims}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {spot.brand ? (
                        <span className="inline-flex items-center gap-1.5 font-medium text-foreground">
                          <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
                          {spot.brand.name}
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400">
                          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                          Disponible
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-right font-mono font-medium">{currency(spot.price)}</td>
                    <td className="px-4 py-3 text-right">
                      {spot.brand ? (
                        <span className="text-xs text-muted-foreground">Ocupado</span>
                      ) : (
                        <Button size="sm" variant="outline" onClick={() => setSelected(spot)}>
                          Reservar
                        </Button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* How it works */}
        <section id="how" className="border-t border-border bg-secondary/40 py-24">
          <div className="mx-auto max-w-5xl px-5">
            <h2 className="text-3xl font-semibold sm:text-4xl">¿Cómo funciona?</h2>
            <div className="mt-10 grid gap-6 sm:grid-cols-3">
              {[
                {
                  icon: MousePointerClick,
                  title: "1. Elige tu espacio",
                  text: "Gira la MacBook interactiva en 3D y selecciona el lugar exacto en la tapa exterior o en el área de reposamuñecas.",
                },
                {
                  icon: Upload,
                  title: "2. Envía tu logo y enlace",
                  text: "Indica el nombre de tu marca, enlace web y contacto. Imprimimos el sticker en vinil resistente de alta durabilidad.",
                },
                {
                  icon: Sparkles,
                  title: "3. Presencia física y digital",
                  text: "Tu marca se exhibirá ante emprendedores, desarrolladores y clientes en Santo Domingo y en redes sociales.",
                },
              ].map(({ icon: Icon, title, text }, i) => (
                <div key={title} className="rounded-2xl border border-border bg-card p-6 shadow-sm">
                  <Icon className="h-5 w-5 text-primary" />
                  <p className="mt-4 font-mono text-xs text-muted-foreground">0{i + 1}</p>
                  <h3 className="mt-1 text-lg font-semibold">{title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{text}</p>
                </div>
              ))}
            </div>
            <Button className="mt-10 gap-2" asChild>
              <a href="#surface">
                Elegir un espacio ahora <ArrowRight className="h-4 w-4" />
              </a>
            </Button>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-border py-10">
        <div className="mx-auto grid max-w-6xl grid-cols-[minmax(0,1fr)_auto] items-center gap-4 px-5 sm:flex sm:justify-between">
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-sm text-muted-foreground">
            <span>© {new Date().getFullYear()} Tu Logo en mi Mac · Santo Domingo, RD</span>
            <span className="hidden sm:inline">·</span>
            <Link to="/admin" className="inline-flex items-center gap-1 hover:text-foreground transition-colors font-medium">
              <Shield className="h-3.5 w-3.5" />
              Panel de Administración
            </Link>
          </div>
          <div className="flex shrink-0 items-center gap-4 text-muted-foreground">
            <a href="#top" aria-label="Twitter" className="hover:text-foreground transition-colors"><Twitter className="h-4 w-4" /></a>
            <a href="#top" aria-label="Instagram" className="hover:text-foreground transition-colors"><Instagram className="h-4 w-4" /></a>
            <a href="#top" aria-label="GitHub" className="hover:text-foreground transition-colors"><Github className="h-4 w-4" /></a>
          </div>
        </div>
      </footer>

      <ClaimDialog
        spot={selected}
        onOpenChange={(open) => !open && setSelected(null)}
        onClaim={handleClaimSuccess}
      />
    </div>
  );
}
