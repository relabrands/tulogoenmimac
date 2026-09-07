import { useCallback, useEffect, useRef, useState } from "react";
import { Plus, RotateCcw } from "lucide-react";
import type { Spot, SpotView } from "@/lib/spots";
import { currency } from "@/lib/spots";
import { cn } from "@/lib/utils";
import { BrandTile } from "./BrandTile";
import lidImg from "@/assets/mac-lid.png";
import insideImg from "@/assets/mac-inside.png";
import lidAsset from "@/assets/mac-lid.png.asset.json";
import insideAsset from "@/assets/mac-inside.png.asset.json";

function Face({
  image,
  fallbackImage,
  alt,
  spots,
  onSelect,
  interactive,
  className,
}: {
  image: string;
  fallbackImage?: string;
  alt: string;
  spots: Spot[];
  onSelect: (spot: Spot) => void;
  interactive: boolean;
  className?: string;
}) {
  const [currentSrc, setCurrentSrc] = useState(image);

  useEffect(() => {
    setCurrentSrc(image);
  }, [image]);

  return (
    <div className={cn("absolute inset-0 flex items-center justify-center [backface-visibility:hidden]", className)}>
      <div className="relative w-full">
        <img
          src={currentSrc}
          alt={alt}
          draggable={false}
          onError={() => {
            if (fallbackImage && currentSrc !== fallbackImage) {
              setCurrentSrc(fallbackImage);
            }
          }}
          className="block h-auto w-full select-none rounded-2xl sm:rounded-3xl"
        />
        {spots.map((spot) => {
          const taken = Boolean(spot.brand);
          const isTransparent =
            taken &&
            (spot.brand?.tone === "transparent" ||
              (!spot.brand?.tone && Boolean(spot.brand?.logoUrl)));

          const handleClick = () => {
            if (!taken) {
              onSelect(spot);
            } else if (spot.brand?.url) {
              const targetUrl = spot.brand.url.startsWith("http")
                ? spot.brand.url
                : `https://${spot.brand.url}`;
              window.open(targetUrl, "_blank", "noopener,noreferrer");
            }
          };

          return (
            <button
              key={spot.id}
              type="button"
              tabIndex={interactive ? 0 : -1}
              onClick={handleClick}
              disabled={!interactive}
              title={
                taken
                  ? `${spot.name} — ${spot.brand?.name}${spot.brand?.url ? ` (${spot.brand.url})` : ""}`
                  : `Reservar ${spot.name} desde ${currency(spot.price)}`
              }
              aria-label={
                taken
                  ? `${spot.name} — reservado por ${spot.brand?.name}`
                  : `Reservar ${spot.name} desde ${currency(spot.price)}`
              }
              style={{
                left: `${spot.pos.x}%`,
                top: `${spot.pos.y}%`,
                width: `${spot.pos.w}%`,
                height: `${spot.pos.h}%`,
              }}
              className={cn(
                "group absolute flex flex-col items-center justify-center overflow-hidden transition duration-200",
                taken
                  ? isTransparent
                    ? "cursor-pointer bg-transparent ring-0 border-0 shadow-none p-0 hover:scale-105"
                    : "cursor-default bg-card/90 ring-1 ring-border backdrop-blur-sm rounded-md p-0.5 sm:rounded-lg sm:p-1 shadow-sm"
                  : "cursor-pointer border-2 border-dashed border-card/60 bg-background/75 backdrop-blur-sm hover:border-card hover:bg-background rounded-md p-0.5 sm:rounded-lg sm:p-1 shadow-sm",
              )}
            >
              {taken ? (
                isTransparent ? (
                  <div className="h-full w-full flex items-center justify-center p-0.5">
                    <BrandTile brand={spot.brand!} compact />
                  </div>
                ) : (
                  <>
                    <div className="h-[66%] w-full">
                      <BrandTile brand={spot.brand!} compact />
                    </div>
                    <span className="mt-0.5 font-mono text-[8px] text-muted-foreground sm:text-[10px]">
                      {currency(spot.price)}
                    </span>
                  </>
                )
              ) : (
                <>
                  <Plus className="h-3 w-3 text-muted-foreground transition group-hover:text-foreground sm:h-3.5 sm:w-3.5" />
                  <span className="mt-0.5 hidden text-[9px] font-medium leading-tight text-muted-foreground sm:block">
                    {spot.size} · {spot.dims}
                  </span>
                  <span className="font-mono text-[8px] leading-tight text-foreground sm:text-[10px]">
                    {currency(spot.price)}
                  </span>
                </>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export function MacSurface({
  view,
  spots,
  onSelect,
  onViewChange,
}: {
  view: SpotView;
  spots: Spot[];
  onSelect: (spot: Spot) => void;
  onViewChange: (view: SpotView) => void;
}) {
  const [angle, setAngle] = useState(view === "lid" ? 0 : 180);
  const [dragging, setDragging] = useState(false);
  const drag = useRef<{ x: number; start: number } | null>(null);

  useEffect(() => {
    setAngle((prev) => {
      const target = view === "lid" ? 0 : 180;
      const base = Math.round(prev / 360) * 360;
      return base + target;
    });
  }, [view]);

  const facing: SpotView = Math.abs(((angle % 360) + 360) % 360 - 180) < 90 ? "inside" : "lid";

  const end = useCallback(() => {
    if (!drag.current) return;
    drag.current = null;
    setDragging(false);
    setAngle((prev) => {
      const snapped = Math.round(prev / 180) * 180;
      onViewChange(((snapped % 360) + 360) % 360 === 180 ? "inside" : "lid");
      return snapped;
    });
  }, [onViewChange]);

  useEffect(() => {
    const move = (e: PointerEvent) => {
      if (!drag.current) return;
      setAngle(drag.current.start + (e.clientX - drag.current.x) * 0.5);
    };
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", end);
    return () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", end);
    };
  }, [end]);

  return (
    <div className="select-none">
      <div
        className="[perspective:1400px] touch-pan-y"
        onPointerDown={(e) => {
          drag.current = { x: e.clientX, start: angle };
          setDragging(true);
        }}
      >
        <div
          className={cn(
            "relative aspect-[1.5] w-full [transform-style:preserve-3d]",
            dragging ? "cursor-grabbing" : "cursor-grab transition-transform duration-700 ease-out",
          )}
          style={{ transform: `rotateY(${angle}deg)` }}
        >
          <Face
            image={lidImg || lidAsset.url}
            fallbackImage={(lidAsset as { remote_url?: string }).remote_url || "/assets/mac-lid.png"}
            alt="Tapa de MacBook con espacios para stickers"
            spots={spots.filter((s) => s.view === "lid")}
            onSelect={onSelect}
            interactive={facing === "lid" && !dragging}
          />
          <Face
            image={insideImg || insideAsset.url}
            fallbackImage={(insideAsset as { remote_url?: string }).remote_url || "/assets/mac-inside.png"}
            alt="Interior del MacBook con teclado y reposamuñecas"
            spots={spots.filter((s) => s.view === "inside")}
            onSelect={onSelect}
            interactive={facing === "inside" && !dragging}
            className="[transform:rotateY(180deg)]"
          />
        </div>
      </div>
      <p className="mt-4 flex items-center justify-center gap-2 text-center text-sm text-muted-foreground">
        <RotateCcw className="h-4 w-4" />
        Arrastra el MacBook para girarlo — haz clic en cualquier espacio punteado para reservarlo.
      </p>
    </div>
  );
}
