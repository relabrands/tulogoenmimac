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
    <div className={cn("absolute inset-0 [backface-visibility:hidden]", className)}>
      <img
        src={currentSrc}
        alt={alt}
        draggable={false}
        onError={() => {
          if (fallbackImage && currentSrc !== fallbackImage) {
            setCurrentSrc(fallbackImage);
          }
        }}
        className="h-full w-full select-none rounded-2xl object-contain sm:rounded-3xl"
      />
      {spots.map((spot) => {
        const taken = Boolean(spot.brand);
        return (
          <button
            key={spot.id}
            type="button"
            tabIndex={interactive ? 0 : -1}
            onClick={() => !taken && onSelect(spot)}
            disabled={taken || !interactive}
            aria-label={
              taken
                ? `${spot.name} — taken by ${spot.brand?.name}`
                : `Claim ${spot.name} from ${currency(spot.price)}`
            }
            style={{
              left: `${spot.pos.x}%`,
              top: `${spot.pos.y}%`,
              width: `${spot.pos.w}%`,
              height: `${spot.pos.h}%`,
            }}
            className={cn(
              "group absolute flex flex-col items-center justify-center overflow-hidden rounded-lg p-1 transition",
              taken
                ? "cursor-default bg-card/90 ring-1 ring-border backdrop-blur-sm"
                : "cursor-pointer border-2 border-dashed border-card/60 bg-background/75 backdrop-blur-sm hover:border-card hover:bg-background",
            )}
          >
            {taken ? (
              <>
                <div className="h-[66%] w-full">
                  <BrandTile brand={spot.brand!} compact />
                </div>
                <span className="mt-0.5 font-mono text-[9px] text-muted-foreground sm:text-[10px]">
                  {currency(spot.price)}
                </span>
              </>
            ) : (
              <>
                <Plus className="h-3.5 w-3.5 text-muted-foreground transition group-hover:text-foreground sm:h-4 sm:w-4" />
                <span className="mt-0.5 hidden text-[10px] font-medium leading-tight text-muted-foreground sm:block">
                  {spot.size} · {spot.dims}
                </span>
                <span className="font-mono text-[9px] leading-tight text-foreground sm:text-[11px]">
                  {currency(spot.price)}
                </span>
              </>
            )}
          </button>
        );
      })}
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
            "relative aspect-[4/3] w-full [transform-style:preserve-3d]",
            dragging ? "cursor-grabbing" : "cursor-grab transition-transform duration-700 ease-out",
          )}
          style={{ transform: `rotateY(${angle}deg)` }}
        >
          <Face
            image={lidImg || lidAsset.url}
            fallbackImage={(lidAsset as { remote_url?: string }).remote_url || "/assets/mac-lid.png"}
            alt="MacBook lid with sponsored sticker spots"
            spots={spots.filter((s) => s.view === "lid")}
            onSelect={onSelect}
            interactive={facing === "lid" && !dragging}
          />
          <Face
            image={insideImg || insideAsset.url}
            fallbackImage={(insideAsset as { remote_url?: string }).remote_url || "/assets/mac-inside.png"}
            alt="MacBook keyboard and palm rest with sponsored sticker spots"
            spots={spots.filter((s) => s.view === "inside")}
            onSelect={onSelect}
            interactive={facing === "inside" && !dragging}
            className="[transform:rotateY(180deg)]"
          />
        </div>
      </div>
      <p className="mt-4 flex items-center justify-center gap-2 text-center text-sm text-muted-foreground">
        <RotateCcw className="h-4 w-4" />
        Drag the MacBook to spin it — tap any dashed spot to claim it.
      </p>
    </div>
  );
}
