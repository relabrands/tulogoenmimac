import { useState } from "react";
import { Check, Link2, Upload } from "lucide-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { currency, type Spot } from "@/lib/spots";

export function ClaimDialog({
  spot,
  onOpenChange,
  onClaim,
}: {
  spot: Spot | null;
  onOpenChange: (open: boolean) => void;
  onClaim: (spot: Spot, brandName: string) => void;
}) {
  const [brandName, setBrandName] = useState("");
  const [url, setUrl] = useState("");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!spot || !brandName.trim()) return;
    onClaim(spot, brandName.trim());
    toast.success(`${brandName.trim()} reserved ${spot.name}`, {
      description: `${currency(spot.price)} · we'll email you to confirm the artwork.`,
    });
    setBrandName("");
    setUrl("");
    onOpenChange(false);
  };

  return (
    <Dialog open={Boolean(spot)} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        {spot && (
          <form onSubmit={submit}>
            <DialogHeader>
              <DialogTitle className="text-2xl">Claim this spot</DialogTitle>
              <DialogDescription>
                {spot.name} · {spot.view === "lid" ? "Outer lid" : "Inside"} · {spot.dims}
              </DialogDescription>
            </DialogHeader>

            <div className="my-5 flex items-baseline justify-between rounded-xl border border-border bg-secondary px-4 py-3">
              <span className="text-sm text-muted-foreground">Starting price</span>
              <span className="font-mono text-2xl font-semibold">{currency(spot.price)}</span>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="brand">Brand name</Label>
                <Input
                  id="brand"
                  value={brandName}
                  onChange={(e) => setBrandName(e.target.value)}
                  placeholder="Colmado.dev"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="url">Link for your logo</Label>
                <div className="relative">
                  <Link2 className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="url"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    placeholder="https://tumarca.do"
                    className="pl-9"
                  />
                </div>
              </div>
              <div className="flex items-center gap-3 rounded-xl border border-dashed border-border px-4 py-3 text-sm text-muted-foreground">
                <Upload className="h-4 w-4 shrink-0" />
                Send your logo (SVG or PNG) after reserving — we cut the sticker here in Santo Domingo.
              </div>
            </div>

            <DialogFooter className="mt-6">
              <Button type="submit" className="w-full gap-2">
                <Check className="h-4 w-4" />
                Reserve for {currency(spot.price)}
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
