import { ACTIVITY } from "@/lib/spots";

export function LiveTicker() {
  const items = [...ACTIVITY, ...ACTIVITY];
  return (
    <div className="overflow-hidden border-b border-border bg-ink py-2 text-ink-foreground">
      <div className="ticker-track flex w-max gap-10 whitespace-nowrap">
        {items.map((item, i) => (
          <span key={i} className="flex items-center gap-2 text-xs">
            <span className="h-1.5 w-1.5 rounded-full bg-success" />
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}
