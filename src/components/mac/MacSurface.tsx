import { useCallback, useEffect, useRef, useState } from "react";
import { Plus, RotateCcw, Layers, Sparkles } from "lucide-react";
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
  finalLook,
  className,
}: {
  image: string;
  fallbackImage?: string;
  alt: string;
  spots: Spot[];
  onSelect: (spot: Spot) => void;
  interactive: boolean;
  finalLook?: boolean;
  className?: string;
}) {
  const [currentSrc, setCurrentSrc] = useState(image);

  useEffect(() => {
    setCurrentSrc(image);
  }, [image]);

  return (
    <div className={cn("absolute inset-0 flex items-center justify-center [backface-visibility:hidden] [-webkit-backface-visibility:hidden]", className)}>
      <div className="relative w-full [backface-visibility:hidden] [-webkit-backface-visibility:hidden]">
        <img
          src={currentSrc}
          alt={alt}
          draggable={false}
          onError={() => {
            if (fallbackImage && currentSrc !== fallbackImage) {
              setCurrentSrc(fallbackImage);
            }
          }}
          className="block h-auto w-full select-none rounded-2xl sm:rounded-3xl shadow-sm [backface-visibility:hidden] [-webkit-backface-visibility:hidden]"
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
                "group absolute flex flex-col items-center justify-center overflow-hidden transition-all duration-300 [backface-visibility:hidden] [-webkit-backface-visibility:hidden]",
                taken
                  ? isTransparent
                    ? "cursor-pointer bg-transparent ring-0 border-0 shadow-none p-0 hover:scale-105"
                    : "cursor-default bg-card/90 ring-1 ring-border backdrop-blur-sm rounded-xl p-0.5 sm:p-1 shadow-sm"
                  : cn(
                      "cursor-pointer rounded-xl transition-all duration-300 p-0.5 sm:p-1",
                      finalLook
                        ? "opacity-0 pointer-events-none scale-95"
                        : "border border-dashed border-white/35 bg-white/[0.04] backdrop-blur-[1.5px] hover:border-white/80 hover:bg-white/[0.12] hover:scale-[1.02] shadow-sm",
                    ),
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
                  <Plus className="h-3 w-3 text-white/70 transition group-hover:text-white group-hover:scale-110 sm:h-3.5 sm:w-3.5" />
                  <span className="mt-0.5 hidden text-[9px] font-medium leading-tight text-white/70 sm:block">
                    {spot.size} · {spot.dims}
                  </span>
                  <span className="font-mono text-[8px] font-semibold leading-tight text-white/95 sm:text-[10px] group-hover:text-white">
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
  const [finalLook, setFinalLook] = useState(false);
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
          style={{
            transform: `rotateY(${angle}deg)`,
            filter: "drop-shadow(0 25px 35px rgba(0,0,0,0.38)) drop-shadow(0 8px 12px rgba(0,0,0,0.22))",
          }}
        >
          <Face
            image={lidImg || lidAsset.url}
            fallbackImage={(lidAsset as { remote_url?: string }).remote_url || "/assets/mac-lid.png"}
            alt="Tapa de MacBook con espacios para stickers"
            spots={spots.filter((s) => s.view === "lid")}
            onSelect={onSelect}
            interactive={facing === "lid" && !dragging}
            finalLook={finalLook}
            className={cn(facing !== "lid" && !dragging ? "pointer-events-none invisible" : "visible")}
          />
          <Face
            image={insideImg || insideAsset.url}
            fallbackImage={(insideAsset as { remote_url?: string }).remote_url || "/assets/mac-inside.png"}
            alt="Interior del MacBook con teclado y reposamuñecas"
            spots={spots.filter((s) => s.view === "inside")}
            onSelect={onSelect}
            interactive={facing === "inside" && !dragging}
            finalLook={finalLook}
            className={cn(
              "[transform:rotateY(180deg)]",
              facing !== "inside" && !dragging ? "pointer-events-none invisible" : "visible",
            )}
          />
        </div>
      </div>

      {/* Selector de modo: Espacios vs Vista Real */}
      <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
        <div className="inline-flex items-center rounded-full border border-border/80 bg-card/80 p-1 shadow-sm backdrop-blur-md">
          <button
            type="button"
            onClick={() => setFinalLook(false)}
            className={cn(
              "flex items-center gap-1.5 rounded-full px-4 py-1.5 text-xs font-medium transition-all",
              !finalLook
                ? "bg-foreground text-background shadow-sm font-semibold"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            <Layers className="h-3.5 w-3.5" />
            Espacios y Precios
          </button>
          <button
            type="button"
            onClick={() => setFinalLook(true)}
            className={cn(
              "flex items-center gap-1.5 rounded-full px-4 py-1.5 text-xs font-medium transition-all",
              finalLook
                ? "bg-foreground text-background shadow-sm font-semibold"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            <Sparkles className="h-3.5 w-3.5 text-amber-500" />
            Vista Final (Real)
          </button>
        </div>
      </div>

      <p className="mt-3 flex items-center justify-center gap-1.5 text-center text-xs text-muted-foreground">
        <RotateCcw className="h-3.5 w-3.5" />
        Arrastra el MacBook para girarlo — haz clic en cualquier espacio para reservarlo.
      </p>
    </div>
  );
}
