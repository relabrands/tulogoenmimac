import { useEffect, useMemo, useState } from "react";
import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import {
  AlertTriangle,
  ArrowUpRight,
  Camera,
  Check,
  ExternalLink,
  Laptop,
  Loader2,
  LogOut,
  Mail,
  MessageCircle,
  Pencil,
  RefreshCw,
  RotateCcw,
  Search,
  Shield,
  Trash2,
  User,
  X,
} from "lucide-react";
import { toast } from "sonner";
import { Toaster } from "@/components/ui/sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useAuth } from "@/lib/auth-context";
import { currency, type Spot, type SpotBrand } from "@/lib/spots";
import {
  subscribeToSpots,
  subscribeToClaims,
  updateSpot,
  updateClaimStatus,
  resetDatabase,
  subscribeToProfile,
  updateProfile,
  DEFAULT_PROFILE,
  type Claim,
  type ClaimStatus,
  type FounderProfile,
} from "@/lib/spots-service";

export const Route = createFileRoute("/admin/")({
  head: () => ({
    meta: [{ title: "Panel de Control — Tu Logo en mi Mac" }],
  }),
  component: AdminDashboard,
});

function AdminDashboard() {
  const { user, loading: authLoading, signOut } = useAuth();
  const navigate = useNavigate();

  const [spots, setSpots] = useState<Spot[]>([]);
  const [claims, setClaims] = useState<Claim[]>([]);
  const [activeTab, setActiveTab] = useState<"solicitudes" | "espacios" | "perfil" | "mantenimiento">("solicitudes");

  // Perfil del fundador
  const [profileForm, setProfileForm] = useState<FounderProfile>(DEFAULT_PROFILE);
  const [savingProfile, setSavingProfile] = useState(false);

  // Filtros de solicitudes
  const [claimsFilter, setClaimsFilter] = useState<"todas" | ClaimStatus>("todas");

  // Filtros de espacios
  const [spotsViewFilter, setSpotsViewFilter] = useState<"todos" | "lid" | "inside">("todos");
  const [spotsStatusFilter, setSpotsStatusFilter] = useState<"todos" | "libres" | "ocupados">("todos");
  const [searchSpot, setSearchSpot] = useState("");

  // Modal de edición de espacio
  const [editingSpot, setEditingSpot] = useState<Spot | null>(null);
  const [editPrice, setEditPrice] = useState<number>(1000);
  const [editBrandName, setEditBrandName] = useState("");
  const [editLogoUrl, setEditLogoUrl] = useState("");
  const [editUrl, setEditUrl] = useState("");
  const [editTagline, setEditTagline] = useState("");
  const [editTone, setEditTone] = useState<"dark" | "light" | "outline" | "transparent">("transparent");
  const [savingSpot, setSavingSpot] = useState(false);

  // Diálogo de reinicio de base de datos
  const [resetDialogOpen, setResetDialogOpen] = useState(false);
  const [resetting, setResetting] = useState(false);

  // Redirección si no está autenticado
  useEffect(() => {
    if (!authLoading && !user) {
      navigate({ to: "/admin/login" });
    }
  }, [user, authLoading, navigate]);

  // Suscripciones en tiempo real
  useEffect(() => {
    const unsubSpots = subscribeToSpots(setSpots);
    const unsubClaims = subscribeToClaims(setClaims);
    const unsubProfile = subscribeToProfile(setProfileForm);
    return () => {
      if (typeof unsubSpots === "function") unsubSpots();
      if (typeof unsubClaims === "function") unsubClaims();
      if (typeof unsubProfile === "function") unsubProfile();
    };
  }, []);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingProfile(true);
    try {
      await updateProfile(profileForm);
      toast.success("¡Perfil actualizado con éxito! La foto y datos se actualizaron en la web.");
    } catch (err) {
      console.error(err);
      toast.error("Error al actualizar el perfil.");
    } finally {
      setSavingProfile(false);
    }
  };

  // Abrir modal de edición para un espacio
  const openEditModal = (spot: Spot) => {
    setEditingSpot(spot);
    setEditPrice(spot.price);
    setEditBrandName(spot.brand?.name ?? "");
    setEditLogoUrl(spot.brand?.logoUrl ?? "");
    setEditUrl(spot.brand?.url ?? "");
    setEditTagline(spot.brand?.tagline ?? "");
    setEditTone(spot.brand?.tone ?? "transparent");
  };

  // Guardar cambios en el espacio
  const handleSaveSpot = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingSpot) return;

    setSavingSpot(true);
    try {
      const hasBrand = Boolean(editBrandName.trim() || editLogoUrl.trim());
      const brandData: SpotBrand | null = hasBrand
        ? {
            name: editBrandName.trim() || (editLogoUrl.trim() ? "Logo Patrocinador" : "Marca"),
            url: editUrl.trim() || undefined,
            logoUrl: editLogoUrl.trim() || undefined,
            tagline: editTagline.trim() || undefined,
            tone: editTone,
          }
        : null;

      await updateSpot(editingSpot.id, {
        price: Number(editPrice) || editingSpot.price,
        brand: brandData,
      });

      toast.success(`Espacio #${editingSpot.id} actualizado correctamente`);
      setEditingSpot(null);
    } catch (err) {
      console.error(err);
      toast.error("Error al guardar los cambios del espacio.");
    } finally {
      setSavingSpot(false);
    }
  };

  // Liberar un espacio (dejarlo sin marca)
  const handleReleaseSpot = async () => {
    if (!editingSpot) return;
    setSavingSpot(true);
    try {
      await updateSpot(editingSpot.id, {
        brand: null,
      });
      setEditBrandName("");
      setEditLogoUrl("");
      setEditUrl("");
      setEditTagline("");
      toast.success(`El espacio #${editingSpot.id} ha sido liberado (100% disponible).`);
      setEditingSpot(null);
    } catch (err) {
      console.error(err);
      toast.error("Error al liberar el espacio.");
    } finally {
      setSavingSpot(false);
    }
  };

  // Cambiar estado de una solicitud
  const handleClaimStatusChange = async (claim: Claim, status: ClaimStatus) => {
    if (!claim.id) return;
    try {
      await updateClaimStatus(claim.id, status, claim);
      if (status === "aprobada") {
        toast.success(`Solicitud de ${claim.brandName} aprobada y asignada al espacio #${claim.spotId}`);
      } else if (status === "rechazada") {
        toast.info(`Solicitud de ${claim.brandName} rechazada`);
      } else {
        toast.info(`Solicitud marcada como pendiente`);
      }
    } catch (err) {
      console.error(err);
      toast.error("Error al actualizar la solicitud.");
    }
  };

  // Confirmar reinicio de base de datos
  const handleConfirmReset = async () => {
    setResetting(true);
    try {
      await resetDatabase();
      toast.success("¡Base de datos reiniciada con éxito! Todos los espacios están 100% disponibles sin datos falsos.");
      setResetDialogOpen(false);
    } catch (err) {
      console.error(err);
      toast.error("Error al reiniciar la base de datos.");
    } finally {
      setResetting(false);
    }
  };

  // Estadísticas calculadas
  const stats = useMemo(() => {
    const totalRaised = spots.filter((s) => s.brand).reduce((acc, s) => acc + s.price, 0);
    const occupiedCount = spots.filter((s) => s.brand).length;
    const pendingClaims = claims.filter((c) => c.status === "pendiente").length;
    return { totalRaised, occupiedCount, pendingClaims, availableCount: spots.length - occupiedCount };
  }, [spots, claims]);

  // Filtrado de solicitudes
  const filteredClaims = useMemo(() => {
    if (claimsFilter === "todas") return claims;
    return claims.filter((c) => c.status === claimsFilter);
  }, [claims, claimsFilter]);

  // Filtrado de espacios
  const filteredSpots = useMemo(() => {
    return spots.filter((s) => {
      if (spotsViewFilter !== "todos" && s.view !== spotsViewFilter) return false;
      if (spotsStatusFilter === "libres" && s.brand) return false;
      if (spotsStatusFilter === "ocupados" && !s.brand) return false;
      if (searchSpot.trim()) {
        const query = searchSpot.toLowerCase();
        const matchesName = s.name.toLowerCase().includes(query);
        const matchesBrand = s.brand?.name.toLowerCase().includes(query) ?? false;
        return matchesName || matchesBrand;
      }
      return true;
    });
  }, [spots, spotsViewFilter, spotsStatusFilter, searchSpot]);

  if (authLoading || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Toaster />

      {/* Top Navbar */}
      <header className="sticky top-0 z-40 border-b border-border bg-background/90 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-3">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground">
              <Laptop className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-semibold text-sm">Tu Logo en mi Mac</span>
                <Badge variant="outline" className="text-[10px] px-1.5 py-0">
                  Admin
                </Badge>
              </div>
              <span className="text-xs text-muted-foreground">{user.email}</span>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <Button size="sm" variant="outline" asChild>
              <Link to="/" target="_blank" className="gap-1.5">
                <ExternalLink className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Ver sitio web</span>
              </Link>
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={async () => {
                await signOut();
                navigate({ to: "/admin/login" });
              }}
              className="gap-1.5 text-muted-foreground hover:text-destructive"
            >
              <LogOut className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Cerrar sesión</span>
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-7xl px-5 py-8">
        {/* Metric Cards */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-8">
          <Card className="border-border">
            <CardHeader className="pb-2">
              <CardDescription className="text-xs">Total Recaudado</CardDescription>
              <CardTitle className="text-2xl font-bold font-mono">
                {currency(stats.totalRaised)}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground">
                De 18 espacios totales
              </p>
            </CardContent>
          </Card>

          <Card className="border-border">
            <CardHeader className="pb-2">
              <CardDescription className="text-xs">Espacios Ocupados</CardDescription>
              <CardTitle className="text-2xl font-bold">
                {stats.occupiedCount} <span className="text-sm font-normal text-muted-foreground">/ 18</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground">
                {stats.availableCount} disponibles para marcas
              </p>
            </CardContent>
          </Card>

          <Card className="border-border">
            <CardHeader className="pb-2">
              <CardDescription className="text-xs">Solicitudes Pendientes</CardDescription>
              <CardTitle className="text-2xl font-bold">
                {stats.pendingClaims}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground">
                Por revisar y confirmar
              </p>
            </CardContent>
          </Card>

          <Card className="border-border">
            <CardHeader className="pb-2">
              <CardDescription className="text-xs">Estado de Datos</CardDescription>
              <CardTitle className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse" />
                100% Real
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground">
                Sin datos ficticios
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={(val) => setActiveTab(val as typeof activeTab)} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 max-w-xl">
            <TabsTrigger value="solicitudes" className="relative">
              Solicitudes
              {stats.pendingClaims > 0 && (
                <span className="ml-1.5 rounded-full bg-amber-500 px-1.5 py-0.2 text-[10px] text-white font-bold">
                  {stats.pendingClaims}
                </span>
              )}
            </TabsTrigger>
            <TabsTrigger value="espacios">Espacios (18)</TabsTrigger>
            <TabsTrigger value="perfil">Mi Perfil</TabsTrigger>
            <TabsTrigger value="mantenimiento">Mantenimiento</TabsTrigger>
          </TabsList>

          {/* TAB 1: SOLICITUDES */}
          <TabsContent value="solicitudes" className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold tracking-tight">Solicitudes de Reserva</h2>
                <p className="text-sm text-muted-foreground">
                  Personas y empresas interesadas en comprar un sticker en tu MacBook.
                </p>
              </div>

              {/* Filtros de estado */}
              <div className="flex items-center gap-2">
                {(["todas", "pendiente", "aprobada", "rechazada"] as const).map((filter) => (
                  <Button
                    key={filter}
                    size="sm"
                    variant={claimsFilter === filter ? "default" : "outline"}
                    onClick={() => setClaimsFilter(filter)}
                    className="capitalize text-xs"
                  >
                    {filter === "todas" ? "Todas" : filter}
                  </Button>
                ))}
              </div>
            </div>

            {filteredClaims.length === 0 ? (
              <Card className="border-dashed p-10 text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-secondary text-muted-foreground mb-3">
                  <Mail className="h-6 w-6" />
                </div>
                <h3 className="font-semibold text-lg">No hay solicitudes</h3>
                <p className="text-sm text-muted-foreground mt-1 max-w-md mx-auto">
                  {claimsFilter === "todas"
                    ? "Aún no se han recibido solicitudes de compra. Cuando un usuario reserve en la web, aparecerá aquí inmediatamente."
                    : `No hay solicitudes con estado "${claimsFilter}".`}
                </p>
              </Card>
            ) : (
              <div className="grid gap-4">
                {filteredClaims.map((claim) => (
                  <Card key={claim.id} className="border-border hover:border-border/80 transition-colors">
                    <CardContent className="p-5">
                      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                        <div className="space-y-2">
                          <div className="flex flex-wrap items-center gap-2">
                            <h3 className="font-bold text-lg">{claim.brandName}</h3>
                            <Badge
                              variant={
                                claim.status === "aprobada"
                                  ? "default"
                                  : claim.status === "rechazada"
                                  ? "destructive"
                                  : "secondary"
                              }
                              className="capitalize text-xs"
                            >
                              {claim.status}
                            </Badge>
                            <span className="text-xs text-muted-foreground font-mono">
                              {new Date(claim.createdAt).toLocaleDateString("es-DO", {
                                year: "numeric",
                                month: "short",
                                day: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </span>
                          </div>

                          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                            <span className="font-medium text-foreground">
                              {claim.spotName} ({claim.spotView === "lid" ? "Tapa exterior" : "Interior"})
                            </span>
                            <span className="font-mono font-semibold text-foreground">
                              {currency(claim.price)}
                            </span>
                          </div>

                          <div className="flex flex-wrap items-center gap-4 text-xs">
                            <a
                              href={`mailto:${claim.email}`}
                              className="inline-flex items-center gap-1 text-primary hover:underline"
                            >
                              <Mail className="h-3.5 w-3.5" />
                              {claim.email}
                            </a>

                            {claim.whatsapp && (
                              <a
                                href={`https://wa.me/${claim.whatsapp.replace(/[^0-9]/g, "")}`}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400 hover:underline"
                              >
                                <MessageCircle className="h-3.5 w-3.5" />
                                {claim.whatsapp}
                              </a>
                            )}

                            {claim.url && (
                              <a
                                href={claim.url.startsWith("http") ? claim.url : `https://${claim.url}`}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center gap-1 text-muted-foreground hover:underline"
                              >
                                <ExternalLink className="h-3.5 w-3.5" />
                                {claim.url}
                              </a>
                            )}
                          </div>
                        </div>

                        {/* Botones de acción */}
                        <div className="flex flex-wrap items-center gap-2 pt-2 lg:pt-0">
                          {claim.status !== "aprobada" && (
                            <Button
                              size="sm"
                              onClick={() => handleClaimStatusChange(claim, "aprobada")}
                              className="gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white"
                            >
                              <Check className="h-3.5 w-3.5" />
                              Aprobar y Asignar
                            </Button>
                          )}

                          {claim.status !== "rechazada" && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleClaimStatusChange(claim, "rechazada")}
                              className="gap-1.5 text-destructive hover:bg-destructive/10"
                            >
                              <X className="h-3.5 w-3.5" />
                              Rechazar
                            </Button>
                          )}

                          {claim.status !== "pendiente" && (
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleClaimStatusChange(claim, "pendiente")}
                              className="text-xs text-muted-foreground"
                            >
                              Pendiente
                            </Button>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          {/* TAB 2: GESTIÓN DE ESPACIOS */}
          <TabsContent value="espacios" className="space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold tracking-tight">Gestión de Espacios (18)</h2>
                <p className="text-sm text-muted-foreground">
                  Modifica precios, asigna marcas, enlaces o URLs de logos directamente.
                </p>
              </div>

              {/* Filtros */}
              <div className="flex flex-wrap items-center gap-2">
                <div className="relative">
                  <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Buscar espacio..."
                    value={searchSpot}
                    onChange={(e) => setSearchSpot(e.target.value)}
                    className="h-8 w-40 pl-8 text-xs sm:w-56"
                  />
                </div>

                <div className="flex items-center rounded-lg border border-border bg-card p-0.5 text-xs">
                  <button
                    onClick={() => setSpotsViewFilter("todos")}
                    className={`rounded-md px-2.5 py-1 font-medium transition ${
                      spotsViewFilter === "todos" ? "bg-foreground text-background" : "text-muted-foreground"
                    }`}
                  >
                    Todos
                  </button>
                  <button
                    onClick={() => setSpotsViewFilter("lid")}
                    className={`rounded-md px-2.5 py-1 font-medium transition ${
                      spotsViewFilter === "lid" ? "bg-foreground text-background" : "text-muted-foreground"
                    }`}
                  >
                    Tapa
                  </button>
                  <button
                    onClick={() => setSpotsViewFilter("inside")}
                    className={`rounded-md px-2.5 py-1 font-medium transition ${
                      spotsViewFilter === "inside" ? "bg-foreground text-background" : "text-muted-foreground"
                    }`}
                  >
                    Interior
                  </button>
                </div>

                <div className="flex items-center rounded-lg border border-border bg-card p-0.5 text-xs">
                  <button
                    onClick={() => setSpotsStatusFilter("todos")}
                    className={`rounded-md px-2.5 py-1 font-medium transition ${
                      spotsStatusFilter === "todos" ? "bg-foreground text-background" : "text-muted-foreground"
                    }`}
                  >
                    Todos
                  </button>
                  <button
                    onClick={() => setSpotsStatusFilter("libres")}
                    className={`rounded-md px-2.5 py-1 font-medium transition ${
                      spotsStatusFilter === "libres" ? "bg-foreground text-background" : "text-muted-foreground"
                    }`}
                  >
                    Libres
                  </button>
                  <button
                    onClick={() => setSpotsStatusFilter("ocupados")}
                    className={`rounded-md px-2.5 py-1 font-medium transition ${
                      spotsStatusFilter === "ocupados" ? "bg-foreground text-background" : "text-muted-foreground"
                    }`}
                  >
                    Ocupados
                  </button>
                </div>
              </div>
            </div>

            {/* Tabla de Espacios */}
            <div className="overflow-hidden rounded-xl border border-border">
              <table className="w-full text-left text-sm">
                <thead className="bg-secondary text-xs uppercase tracking-wide text-muted-foreground">
                  <tr>
                    <th className="px-4 py-3 font-medium">#</th>
                    <th className="px-4 py-3 font-medium">Espacio</th>
                    <th className="px-4 py-3 font-medium">Ubicación</th>
                    <th className="hidden px-4 py-3 font-medium md:table-cell">Medidas</th>
                    <th className="px-4 py-3 font-medium">Precio</th>
                    <th className="px-4 py-3 font-medium">Marca Asignada</th>
                    <th className="px-4 py-3 text-right font-medium">Acción</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredSpots.map((spot) => (
                    <tr key={spot.id} className="border-t border-border hover:bg-secondary/20 transition-colors">
                      <td className="px-4 py-3 font-mono text-xs text-muted-foreground">
                        {spot.id}
                      </td>
                      <td className="px-4 py-3">
                        <div className="font-medium">{spot.name}</div>
                      </td>
                      <td className="px-4 py-3 text-xs text-muted-foreground">
                        {spot.view === "lid" ? "Tapa exterior" : "Interior (teclado)"}
                      </td>
                      <td className="hidden px-4 py-3 text-xs text-muted-foreground md:table-cell">
                        {spot.size} · {spot.dims}
                      </td>
                      <td className="px-4 py-3 font-mono font-medium">
                        {currency(spot.price)}
                      </td>
                      <td className="px-4 py-3">
                        {spot.brand ? (
                          <div className="flex items-center gap-2">
                            {spot.brand.logoUrl ? (
                              <img
                                src={spot.brand.logoUrl}
                                alt={spot.brand.name}
                                className="h-6 w-6 rounded object-contain bg-card border border-border"
                              />
                            ) : null}
                            <div>
                              <span className="font-semibold text-xs text-foreground block">
                                {spot.brand.name}
                              </span>
                              {spot.brand.url && (
                                <a
                                  href={spot.brand.url}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="text-[10px] text-primary hover:underline flex items-center gap-0.5"
                                >
                                  {spot.brand.url} <ArrowUpRight className="h-2.5 w-2.5" />
                                </a>
                              )}
                            </div>
                          </div>
                        ) : (
                          <Badge variant="outline" className="text-xs text-emerald-600 dark:text-emerald-400 border-emerald-500/30">
                            Libre
                          </Badge>
                        )}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => openEditModal(spot)}
                          className="gap-1.5 h-8 text-xs"
                        >
                          <Pencil className="h-3 w-3" />
                          Editar
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </TabsContent>

          {/* TAB 3: MI PERFIL */}
          <TabsContent value="perfil" className="space-y-6">
            <div>
              <h2 className="text-xl font-bold tracking-tight">Foto y Perfil de Robinson Sánchez Sena</h2>
              <p className="text-sm text-muted-foreground">
                Configura tu foto de perfil (avatar) y datos visibles en la sección "Sobre mí" de la página principal.
              </p>
            </div>

            <Card className="border-border max-w-2xl">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <User className="h-5 w-5 text-primary" />
                  Foto y Datos del Fundador
                </CardTitle>
                <CardDescription>
                  Si dejas la URL de imagen vacía, se mostrará el monograma de iniciales "RS" automáticamente.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Vista previa del avatar */}
                <div className="flex items-center gap-5 p-4 rounded-xl border border-border bg-secondary/30">
                  <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-2xl bg-secondary border border-border text-foreground font-mono text-2xl font-bold overflow-hidden shadow-inner">
                    {profileForm.avatarUrl ? (
                      <img
                        src={profileForm.avatarUrl}
                        alt="Foto de perfil"
                        className="h-full w-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLElement).style.display = "none";
                        }}
                      />
                    ) : (
                      <span>RS</span>
                    )}
                  </div>
                  <div className="space-y-1">
                    <h4 className="font-semibold text-sm">Vista previa del avatar</h4>
                    <p className="text-xs text-muted-foreground">
                      {profileForm.avatarUrl
                        ? "Foto personalizada activa."
                        : "Sin foto cargada (mostrando iniciales RS)."}
                    </p>
                    {profileForm.avatarUrl && (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => setProfileForm((prev) => ({ ...prev, avatarUrl: "" }))}
                        className="mt-2 h-7 text-xs text-destructive hover:bg-destructive/10"
                      >
                        Quitar foto (volver a RS)
                      </Button>
                    )}
                  </div>
                </div>

                <form onSubmit={handleSaveProfile} className="space-y-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="prof-avatar" className="flex items-center gap-1.5">
                      <Camera className="h-4 w-4 text-muted-foreground" />
                      URL de la imagen o foto de perfil
                    </Label>
                    <Input
                      id="prof-avatar"
                      placeholder="https://ejemplo.com/tu-foto.jpg"
                      value={profileForm.avatarUrl || ""}
                      onChange={(e) =>
                        setProfileForm((prev) => ({ ...prev, avatarUrl: e.target.value }))
                      }
                    />
                    <p className="text-[11px] text-muted-foreground">
                      Ingresa el enlace directo a tu fotografía (formato JPG, PNG o WebP de LinkedIn, Cloudinary, etc.).
                    </p>
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="prof-name">Nombre completo</Label>
                    <Input
                      id="prof-name"
                      value={profileForm.name}
                      onChange={(e) =>
                        setProfileForm((prev) => ({ ...prev, name: e.target.value }))
                      }
                      required
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="prof-title">Cargo / Rol</Label>
                    <Input
                      id="prof-title"
                      value={profileForm.title}
                      onChange={(e) =>
                        setProfileForm((prev) => ({ ...prev, title: e.target.value }))
                      }
                      required
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="prof-location">Ubicación</Label>
                    <Input
                      id="prof-location"
                      value={profileForm.location}
                      onChange={(e) =>
                        setProfileForm((prev) => ({ ...prev, location: e.target.value }))
                      }
                      required
                    />
                  </div>

                  <Button type="submit" disabled={savingProfile} className="gap-2">
                    {savingProfile ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Guardando cambios...
                      </>
                    ) : (
                      <>
                        <Check className="h-4 w-4" />
                        Guardar Perfil
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          {/* TAB 4: MANTENIMIENTO */}
          <TabsContent value="mantenimiento" className="space-y-6">
            <div>
              <h2 className="text-xl font-bold tracking-tight">Mantenimiento y Control de Datos</h2>
              <p className="text-sm text-muted-foreground">
                Herramientas para sincronización, reinicio a cero y auditoría de la base de datos.
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <Card className="border-border">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <RefreshCw className="h-5 w-5 text-primary" />
                    Sincronización con Firebase
                  </CardTitle>
                  <CardDescription>
                    La aplicación está configurada para sincronizar datos en Firestore (colecciones <code>spots</code> y <code>claims</code>).
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                  <div className="rounded-lg bg-secondary/50 p-3 text-xs space-y-1">
                    <p className="font-semibold">ID del proyecto:</p>
                    <code className="text-primary">tu-logo-en-mi-mac</code>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Los cambios realizados en este panel se reflejan inmediatamente en la interfaz pública tanto para visitantes web como para la base de datos.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-destructive/30 bg-destructive/5">
                <CardHeader>
                  <CardTitle className="text-lg text-destructive flex items-center gap-2">
                    <RotateCcw className="h-5 w-5" />
                    Reiniciar Base de Datos a Cero
                  </CardTitle>
                  <CardDescription>
                    Deja todos los 18 espacios 100% libres y elimina cualquier marca o dato de prueba.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-xs text-muted-foreground">
                    Usa esta acción para asegurar que no quede ninguna marca falsa o de muestra. Todos los 18 espacios volverán a tener <code>brand: null</code> y sus precios base.
                  </p>
                  <Button
                    variant="destructive"
                    onClick={() => setResetDialogOpen(true)}
                    className="w-full gap-2"
                  >
                    <Trash2 className="h-4 w-4" />
                    Reiniciar todos los espacios a cero
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </main>

      {/* DIÁLOGO DE EDICIÓN DE ESPACIO */}
      <Dialog open={Boolean(editingSpot)} onOpenChange={(open) => !open && setEditingSpot(null)}>
        <DialogContent className="sm:max-w-lg">
          {editingSpot && (
            <form onSubmit={handleSaveSpot}>
              <DialogHeader>
                <DialogTitle className="text-xl">
                  Editar Espacio #{editingSpot.id}: {editingSpot.name}
                </DialogTitle>
                <DialogDescription>
                  {editingSpot.view === "lid" ? "Tapa exterior" : "Interior / Teclado"} · {editingSpot.dims}
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4 my-5 max-h-[70vh] overflow-y-auto px-1">
                {/* Precio */}
                <div className="space-y-1.5">
                  <Label htmlFor="edit-price">Precio en pesos dominicanos (RD$)</Label>
                  <Input
                    id="edit-price"
                    type="number"
                    value={editPrice}
                    onChange={(e) => setEditPrice(Number(e.target.value))}
                    min={100}
                    step={100}
                    required
                  />
                </div>

                <div className="rounded-xl border border-border p-4 space-y-3 bg-secondary/20">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-sm">Información de la Marca / Patrocinador</span>
                    {editBrandName && (
                      <button
                        type="button"
                        onClick={handleReleaseSpot}
                        className="text-xs text-destructive hover:underline font-medium"
                      >
                        Liberar espacio (dejar libre)
                      </button>
                    )}
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="edit-brand">Nombre de la marca</Label>
                    <Input
                      id="edit-brand"
                      placeholder="Dejar vacío si el espacio está libre"
                      value={editBrandName}
                      onChange={(e) => setEditBrandName(e.target.value)}
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="edit-url">Enlace o sitio web de la marca</Label>
                    <Input
                      id="edit-url"
                      placeholder="https://tumarca.com"
                      value={editUrl}
                      onChange={(e) => setEditUrl(e.target.value)}
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="edit-logo">URL de la imagen o logo (opcional)</Label>
                    <Input
                      id="edit-logo"
                      placeholder="https://... o ruta de imagen"
                      value={editLogoUrl}
                      onChange={(e) => setEditLogoUrl(e.target.value)}
                    />
                    {editLogoUrl && (
                      <div className="mt-2 flex items-center gap-3 rounded-lg border border-border p-2 bg-card">
                        <span className="text-xs text-muted-foreground">Vista previa del logo:</span>
                        <img
                          src={editLogoUrl}
                          alt="Preview"
                          className="h-8 max-w-[120px] object-contain rounded"
                          onError={(e) => {
                            (e.target as HTMLElement).style.display = "none";
                          }}
                        />
                      </div>
                    )}
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="edit-tagline">Eslogan corto (opcional)</Label>
                    <Input
                      id="edit-tagline"
                      placeholder="ej. El software para tu negocio"
                      value={editTagline}
                      onChange={(e) => setEditTagline(e.target.value)}
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="edit-tone">Estilo visual del sticker</Label>
                    <select
                      id="edit-tone"
                      value={editTone}
                      onChange={(e) => setEditTone(e.target.value as "dark" | "light" | "outline" | "transparent")}
                      className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm"
                    >
                      <option value="transparent">✨ Solo el logo (transparente, sin fondo blanco)</option>
                      <option value="dark">Fondo oscuro (Dark sticker)</option>
                      <option value="light">Fondo claro (Light sticker)</option>
                      <option value="outline">Borde sutil (Outline)</option>
                    </select>
                  </div>
                </div>
              </div>

              <DialogFooter className="gap-2 sm:gap-0">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setEditingSpot(null)}
                  disabled={savingSpot}
                >
                  Cancelar
                </Button>
                <Button type="submit" disabled={savingSpot} className="gap-2">
                  {savingSpot ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Guardando...
                    </>
                  ) : (
                    <>
                      <Check className="h-4 w-4" />
                      Guardar Cambios
                    </>
                  )}
                </Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>

      {/* DIÁLOGO DE CONFIRMACIÓN DE REINICIO DE BASE DE DATOS */}
      <AlertDialog open={resetDialogOpen} onOpenChange={setResetDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2 text-destructive">
              <AlertTriangle className="h-5 w-5" />
              ¿Confirmas reiniciar la base de datos a cero?
            </AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción liberará todos los 18 espacios de stickers dejándolos 100% disponibles sin marcas ficticias, y reiniciará el contador de recaudación para arrancar desde cero.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={resetting}>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmReset}
              disabled={resetting}
              className="bg-destructive hover:bg-destructive/90 text-destructive-foreground"
            >
              {resetting ? "Reiniciando..." : "Sí, reiniciar todo"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
