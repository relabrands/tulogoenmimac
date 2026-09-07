import type { Spot } from "@/lib/spots";
import { cn } from "@/lib/utils";

export function BrandTile({ brand, compact }: { brand: NonNullable<Spot["brand"]>; compact?: boolean }) {
  if (brand.logoUrl) {
    return (
      <div className="relative flex h-full w-full items-center justify-center p-0.5">
        <img
          src={brand.logoUrl}
          alt={brand.name}
          className="max-h-full max-w-full object-contain filter drop-shadow-md"
          loading="lazy"
        />
      </div>
    );
  }

  return (
    <div
      className={cn(
        "flex h-full w-full flex-col items-center justify-center gap-0.5 rounded-md px-1 text-center sm:px-2",
        brand.tone === "dark" && "bg-ink text-ink-foreground",
        brand.tone === "light" && "bg-card text-foreground border border-border",
        brand.tone === "outline" && "bg-secondary text-secondary-foreground border border-border/50",
        brand.tone === "transparent" && "bg-transparent text-foreground drop-shadow",
        !brand.tone && "bg-ink text-ink-foreground",
      )}
    >
      <span
        className={cn(
          "font-semibold leading-tight tracking-tight",
          compact ? "text-[9px] leading-[1.1] sm:text-[11px]" : "text-xs sm:text-sm",
        )}
      >
        {brand.name}
      </span>
      {brand.tagline && !compact && (
        <span className="hidden text-[10px] leading-tight opacity-60 sm:block">{brand.tagline}</span>
      )}
    </div>
  );
}
