import { useEffect, useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import {
  Apple,
  ArrowRight,
  Briefcase,
  ExternalLink,
  Instagram,
  Laptop,
  Linkedin,
  MousePointerClick,
  Sparkles,
  Upload,
  UserCheck,
} from "lucide-react";
import { Toaster } from "@/components/ui/sonner";
import { Button } from "@/components/ui/button";
import { MacSurface } from "@/components/mac/MacSurface";
import { ClaimDialog } from "@/components/mac/ClaimDialog";
import { LiveTicker } from "@/components/mac/LiveTicker";
import { GOAL, SPOTS, currency, type Spot, type SpotView } from "@/lib/spots";
import {
  subscribeToSpots,
  subscribeToProfile,
  DEFAULT_PROFILE,
  type FounderProfile,
} from "@/lib/spots-service";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Tu Logo en mi Mac — Tu marca en la MacBook de un fundador" },
      {
        name: "description",
        content:
          "Consigue un espacio exclusivo para tu logo en una MacBook Air M5 en Santo Domingo. Espacios en la tapa exterior y teclado desde RD$1,000.",
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
  const [profile, setProfile] = useState<FounderProfile>(DEFAULT_PROFILE);
  const [view, setView] = useState<SpotView>("lid");
  const [selected, setSelected] = useState<Spot | null>(null);

  useEffect(() => {
    const unsubSpots = subscribeToSpots((liveSpots) => {
      setSpots(liveSpots);
    });
    const unsubProfile = subscribeToProfile((liveProfile) => {
      setProfile(liveProfile);
    });
    return () => {
      if (typeof unsubSpots === "function") unsubSpots();
      if (typeof unsubProfile === "function") unsubProfile();
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
            <a href="#about" className="hover:text-foreground transition-colors">Sobre mí</a>
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
            Tu logo viaja conmigo en la herramienta de trabajo más visible de un creador: una MacBook Air M5 que visita cafés, eventos tech, coworkings y reuniones a diario.
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
        <section id="surface" className="relative mx-auto max-w-4xl px-5 pb-20">
          <div className="pointer-events-none absolute inset-0 -top-8 flex items-center justify-center overflow-hidden">
            <div className="h-[420px] w-[640px] rounded-full bg-gradient-to-tr from-primary/10 via-slate-400/5 to-transparent blur-3xl opacity-70" />
          </div>
          <div className="relative z-10 mb-6 flex justify-center">
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
        {/* Sobre mí */}
        <section id="about" className="border-t border-border py-24">
          <div className="mx-auto max-w-5xl px-5">
            <div className="grid gap-10 lg:grid-cols-[280px_1fr] items-start">
              {/* Tarjeta de Perfil */}
              <div className="rounded-2xl border border-border bg-card p-6 shadow-sm text-center lg:text-left">
                <div className="mx-auto lg:mx-0 flex h-20 w-20 items-center justify-center rounded-2xl bg-secondary border border-border text-foreground font-mono text-xl font-bold mb-4 shadow-inner overflow-hidden">
                  {profile.avatarUrl ? (
                    <img
                      src={profile.avatarUrl}
                      alt={profile.name}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <span>RS</span>
                  )}
                </div>
                <h3 className="text-xl font-bold tracking-tight">{profile.name}</h3>
                <p className="text-sm text-primary font-medium mt-1">{profile.title}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{profile.location}</p>

                <div className="mt-4 pt-4 border-t border-border flex flex-wrap gap-1.5 justify-center lg:justify-start">
                  {(profile.tags && profile.tags.length > 0 ? profile.tags : ["Fintech", "Healthtech", "Marketing Ops"]).map((tag) => (
                    <span key={tag} className="rounded-md bg-secondary px-2 py-0.5 text-[11px] font-medium text-secondary-foreground">
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="mt-4 pt-4 border-t border-border flex items-center justify-center lg:justify-start gap-3 text-muted-foreground">
                  <a
                    href="https://www.instagram.com/robinsonnsanchez/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-xs hover:text-foreground transition-colors"
                  >
                    <Instagram className="h-3.5 w-3.5" />
                    <span>Instagram</span>
                  </a>
                  <span className="text-muted-foreground/40">·</span>
                  <a
                    href="https://do.linkedin.com/in/robinsonsanchez"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-xs hover:text-foreground transition-colors"
                  >
                    <Linkedin className="h-3.5 w-3.5" />
                    <span>LinkedIn</span>
                  </a>
                </div>
              </div>

              {/* Biografía y propósito */}
              <div className="space-y-6">
                <div>
                  <span className="text-xs uppercase tracking-widest text-muted-foreground font-semibold">
                    Detrás de la MacBook
                  </span>
                  <h2 className="text-3xl font-bold tracking-tight mt-1 sm:text-4xl">
                    Sobre mí
                  </h2>
                </div>

                <div className="space-y-4 text-base text-muted-foreground leading-relaxed">
                  <p>
                    Robinson Sánchez Sena es un emprendedor dominicano, constructor de empresas (<span className="text-foreground font-medium">venture builder</span>) y estratega de negocios enfocado en el desarrollo de startups tecnológicas y ecosistemas de marketing en la República Dominicana.
                  </p>
                  <p>
                    Su trabajo destaca principalmente en los sectores de tecnología financiera (<span className="text-foreground font-medium">fintech</span>), salud digital (<span className="text-foreground font-medium">healthtech</span>) y marketing operativo.
                  </p>
                  <div className="rounded-xl border border-primary/20 bg-primary/5 p-4 text-foreground text-sm font-medium">
                    Actualmente impulsando <strong>Nomi</strong>, la primera plataforma de bienestar financiero de la República Dominicana.
                  </div>
                  <p className="text-sm">
                    Esta MacBook Pro me acompaña a diario a reuniones de negocios, eventos del ecosistema de tecnología, espacios de coworking, cafés y conferencias en Santo Domingo. Cada sticker colocado en este equipo es una vitrina en movimiento con exposición real ante fundadores, líderes de opinión y potenciales clientes.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-border py-12">
        <div className="mx-auto max-w-6xl px-5 space-y-6">
          <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4 sm:flex sm:justify-between">
            <p className="text-sm font-medium text-foreground">
              © {new Date().getFullYear()} Tu Logo en mi Mac · Santo Domingo, República Dominicana
            </p>
            <div className="flex shrink-0 items-center gap-4 text-muted-foreground">
              <a
                href="https://www.instagram.com/robinsonnsanchez/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="hover:text-foreground transition-colors"
              >
                <Instagram className="h-4 w-4" />
              </a>
              <a
                href="https://do.linkedin.com/in/robinsonsanchez"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                className="hover:text-foreground transition-colors"
              >
                <Linkedin className="h-4 w-4" />
              </a>
            </div>
          </div>

          <div className="pt-4 border-t border-border/60">
            <p className="text-xs text-muted-foreground leading-relaxed max-w-3xl">
              Tu Logo en mi Mac no está afiliado, respaldado ni patrocinado por Apple Inc. MacBook Pro y Mac son marcas comerciales registradas de Apple Inc.
            </p>
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
