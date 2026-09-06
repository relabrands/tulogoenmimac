import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Apple, ArrowRight, Github, Instagram, Laptop, MousePointerClick, Sparkles, Twitter, Upload } from "lucide-react";
import { Toaster } from "@/components/ui/sonner";
import { Button } from "@/components/ui/button";
import { MacSurface } from "@/components/mac/MacSurface";
import { ClaimDialog } from "@/components/mac/ClaimDialog";
import { LiveTicker } from "@/components/mac/LiveTicker";
import { GOAL, SPOTS, currency, type Spot, type SpotView } from "@/lib/spots";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Brand My Mac RD — Your brand, on my Mac." },
      {
        name: "description",
        content:
          "A Dominican founder is selling sticker spots on his MacBook. Claim a lid or keyboard spot from RD$1,000 and travel with the laptop.",
      },
      { property: "og:title", content: "Brand My Mac RD — Your brand, on my Mac." },
      {
        property: "og:description",
        content: "Sponsor a spot on a founder's MacBook. Spots from RD$1,000, live auction in Santo Domingo.",
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

  const raised = useMemo(
    () => spots.filter((s) => s.brand).reduce((sum, s) => sum + s.price, 0),
    [spots],
  );
  const available = spots.filter((s) => !s.brand);
  const cheapest = Math.min(...available.map((s) => s.price));
  const pct = Math.round((raised / GOAL) * 100);

  const claim = (spot: Spot, brandName: string) =>
    setSpots((prev) =>
      prev.map((s) => (s.id === spot.id ? { ...s, brand: { name: brandName, tone: "dark" } } : s)),
    );

  return (
    <div className="min-h-screen bg-background">
      <Toaster />
      <LiveTicker />

      <header className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur">
        <div className="mx-auto grid max-w-6xl grid-cols-[minmax(0,1fr)_auto] items-center gap-4 px-5 py-3 sm:flex sm:justify-between">
          <a href="#top" className="flex min-w-0 items-center gap-2">
            <Laptop className="h-5 w-5 shrink-0" />
            <span className="truncate text-sm font-semibold tracking-tight">Brand My Mac RD</span>
          </a>
          <nav className="hidden items-center gap-7 text-sm text-muted-foreground md:flex">
            <a href="#surface" className="hover:text-foreground">The Mac</a>
            <a href="#pricing" className="hover:text-foreground">Pricing</a>
            <a href="#how" className="hover:text-foreground">How it works</a>
          </nav>
          <Button size="sm" asChild>
            <a href="#surface">Get a spot</a>
          </Button>
        </div>
      </header>

      <main id="top">
        {/* Hero */}
        <section className="mx-auto max-w-3xl px-5 pb-10 pt-16 text-center sm:pt-24">
          <p className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-xs text-muted-foreground">
            <span className="h-1.5 w-1.5 rounded-full bg-success" />
            {available.length} spots left · Santo Domingo, RD
          </p>
          <h1 className="text-5xl font-semibold leading-[1.05] sm:text-7xl">Your brand, on my Mac.</h1>
          <p className="mx-auto mt-5 max-w-xl text-base text-muted-foreground sm:text-lg">
            Your logo travels with me on a founder's best friend: the MacBook.
          </p>

          <div className="mx-auto mt-10 max-w-lg">
            <div className="flex items-baseline justify-between">
              <span className="font-mono text-3xl font-semibold">{currency(raised)}</span>
              <span className="text-sm text-muted-foreground">
                {pct >= 100 ? `goal passed · ${pct}%` : `${pct}% of goal`}
              </span>
            </div>
            <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-secondary">
              <div
                className="h-full rounded-full bg-foreground transition-all duration-700"
                style={{ width: `${Math.min(pct, 100)}%` }}
              />
            </div>
            <p className="mt-3 text-sm text-muted-foreground">
              raised · Spots from {currency(cheapest)} · {available.length} still available
            </p>
          </div>
        </section>

        {/* Surface */}
        <section id="surface" className="mx-auto max-w-3xl px-5 pb-20">
          <div className="mb-6 flex justify-center">
            <div className="inline-flex rounded-full border border-border bg-card p-1">
              {(["lid", "inside"] as SpotView[]).map((v) => (
                <button
                  key={v}
                  onClick={() => setView(v)}
                  className={cn(
                    "rounded-full px-5 py-1.5 text-sm font-medium capitalize transition",
                    view === v ? "bg-foreground text-background" : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  {v === "lid" ? "Lid" : "Inside"}
                </button>
              ))}
            </div>
          </div>

          <MacSurface view={view} spots={spots} onSelect={setSelected} onViewChange={setView} />

        </section>

        {/* Statement */}
        <section className="bg-ink py-24 text-ink-foreground">
          <div className="mx-auto max-w-3xl px-5 text-center">
            <Apple className="mx-auto mb-8 h-8 w-8 fill-current opacity-70" />
            <h2 className="text-4xl font-semibold leading-tight sm:text-5xl">
              Everyone recognises the apple.
              <span className="block opacity-45">Show your logo right next to it.</span>
            </h2>
          </div>
        </section>

        {/* Pricing */}
        <section id="pricing" className="mx-auto max-w-5xl px-5 py-24">
          <h2 className="text-3xl font-semibold sm:text-4xl">Every spot, every price.</h2>
          <p className="mt-2 text-muted-foreground">
            Small from RD$1,000 · Medium from RD$1,800 · Large from RD$3,800, with a premium next to the Apple logo.
          </p>

          <div className="mt-8 overflow-hidden rounded-2xl border border-border">
            <table className="w-full text-left text-sm">
              <thead className="bg-secondary text-xs uppercase tracking-wide text-muted-foreground">
                <tr>
                  <th className="px-4 py-3 font-medium">Spot</th>
                  <th className="hidden px-4 py-3 font-medium sm:table-cell">Size</th>
                  <th className="px-4 py-3 font-medium">Held by</th>
                  <th className="px-4 py-3 text-right font-medium">Price</th>
                  <th className="px-4 py-3" />
                </tr>
              </thead>
              <tbody>
                {spots.map((spot) => (
                  <tr key={spot.id} className="border-t border-border">
                    <td className="px-4 py-3">
                      <div className="min-w-0">
                        <p className="truncate font-medium">{spot.name}</p>
                        <p className="text-xs capitalize text-muted-foreground">{spot.view}</p>
                      </div>
                    </td>
                    <td className="hidden px-4 py-3 text-muted-foreground sm:table-cell">
                      {spot.size} · {spot.dims}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">{spot.brand?.name ?? "Available"}</td>
                    <td className="px-4 py-3 text-right font-mono">{currency(spot.price)}</td>
                    <td className="px-4 py-3 text-right">
                      {spot.brand ? (
                        <span className="text-xs text-muted-foreground">Taken</span>
                      ) : (
                        <Button size="sm" variant="outline" onClick={() => setSelected(spot)}>
                          Claim
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
            <h2 className="text-3xl font-semibold sm:text-4xl">How it works</h2>
            <div className="mt-10 grid gap-6 sm:grid-cols-3">
              {[
                { icon: MousePointerClick, title: "Pick a spot", text: "Choose the lid or the inside, then tap the surface you want." },
                { icon: Upload, title: "Upload your logo & link", text: "Send an SVG or PNG. We print and place it within 48 hours." },
                { icon: Sparkles, title: "Get seen online & IRL", text: "Cafés, meetups, demo days and every build-in-public video." },
              ].map(({ icon: Icon, title, text }, i) => (
                <div key={title} className="rounded-2xl border border-border bg-card p-6">
                  <Icon className="h-5 w-5" />
                  <p className="mt-4 font-mono text-xs text-muted-foreground">0{i + 1}</p>
                  <h3 className="mt-1 text-lg font-semibold">{title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{text}</p>
                </div>
              ))}
            </div>
            <Button className="mt-10 gap-2" asChild>
              <a href="#surface">
                Claim a spot <ArrowRight className="h-4 w-4" />
              </a>
            </Button>
          </div>
        </section>
      </main>

      <footer className="border-t border-border py-10">
        <div className="mx-auto grid max-w-6xl grid-cols-[minmax(0,1fr)_auto] items-center gap-4 px-5 sm:flex sm:justify-between">
          <p className="min-w-0 truncate text-sm text-muted-foreground">
            © {new Date().getFullYear()} Brand My Mac RD · Santo Domingo
          </p>
          <div className="flex shrink-0 items-center gap-4 text-muted-foreground">
            <a href="#top" aria-label="Twitter" className="hover:text-foreground"><Twitter className="h-4 w-4" /></a>
            <a href="#top" aria-label="Instagram" className="hover:text-foreground"><Instagram className="h-4 w-4" /></a>
            <a href="#top" aria-label="GitHub" className="hover:text-foreground"><Github className="h-4 w-4" /></a>
          </div>
        </div>
      </footer>

      <ClaimDialog spot={selected} onOpenChange={(open) => !open && setSelected(null)} onClaim={claim} />
    </div>
  );
}
