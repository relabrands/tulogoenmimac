import { useState } from "react";
import { Check, Globe, Mail, Phone, Upload, Loader2 } from "lucide-react";
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
import { createClaim } from "@/lib/spots-service";

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
  const [email, setEmail] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!spot || !brandName.trim() || !email.trim()) {
      toast.error("Por favor completa los campos obligatorios.");
      return;
    }

    setLoading(true);
    try {
      await createClaim({
        spotId: spot.id,
        spotName: spot.name,
        spotView: spot.view,
        price: spot.price,
        brandName: brandName.trim(),
        url: url.trim() || undefined,
        email: email.trim(),
        whatsapp: whatsapp.trim() || undefined,
      });

      onClaim(spot, brandName.trim());
      toast.success(`¡Solicitud enviada para ${spot.name}!`, {
        description: `Precio: ${currency(spot.price)}. Te contactaremos a ${email.trim()} o WhatsApp para coordinar el sticker.`,
      });

      setBrandName("");
      setUrl("");
      setEmail("");
      setWhatsapp("");
      onOpenChange(false);
    } catch (err) {
      console.error(err);
      toast.error("Hubo un problema al enviar la solicitud. Intenta nuevamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={Boolean(spot)} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        {spot && (
          <form onSubmit={submit}>
            <DialogHeader>
              <DialogTitle className="text-2xl">Reservar este espacio</DialogTitle>
              <DialogDescription>
                {spot.name} · {spot.view === "lid" ? "Tapa exterior" : "Interior"} · {spot.dims}
              </DialogDescription>
            </DialogHeader>

            <div className="my-4 flex items-baseline justify-between rounded-xl border border-border bg-secondary px-4 py-3">
              <span className="text-sm text-muted-foreground">Inversión del sticker</span>
              <span className="font-mono text-2xl font-semibold">{currency(spot.price)}</span>
            </div>

            <div className="space-y-3.5">
              <div className="space-y-1.5">
                <Label htmlFor="brand">Nombre de la marca o empresa *</Label>
                <Input
                  id="brand"
                  value={brandName}
                  onChange={(e) => setBrandName(e.target.value)}
                  placeholder="ej. MiStartup, Colmado.dev"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="email">Correo electrónico de contacto *</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="contacto@tumarca.com"
                    className="pl-9"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="whatsapp">WhatsApp / Teléfono</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="whatsapp"
                    type="tel"
                    value={whatsapp}
                    onChange={(e) => setWhatsapp(e.target.value)}
                    placeholder="+1 (829) 555-0123"
                    className="pl-9"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="url">Enlace o web de tu marca</Label>
                <div className="relative">
                  <Globe className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="url"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    placeholder="https://tumarca.com"
                    className="pl-9"
                  />
                </div>
              </div>

              <div className="flex items-start gap-3 rounded-xl border border-dashed border-border p-3 text-xs text-muted-foreground">
                <Upload className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                <span>
                  Envía tu logo (SVG o PNG en alta resolución) al confirmar. Imprimimos el sticker en vinil premium troquelado aquí en Santo Domingo.
                </span>
              </div>
            </div>

            <DialogFooter className="mt-6">
              <Button type="submit" disabled={loading} className="w-full gap-2 font-medium">
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Enviando solicitud...
                  </>
                ) : (
                  <>
                    <Check className="h-4 w-4" />
                    Reservar por {currency(spot.price)}
                  </>
                )}
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
