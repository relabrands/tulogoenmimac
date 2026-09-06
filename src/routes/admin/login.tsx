import { useEffect, useState } from "react";
import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { ArrowLeft, KeyRound, Laptop, Loader2, Lock, Mail } from "lucide-react";
import { toast } from "sonner";
import { Toaster } from "@/components/ui/sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/lib/auth-context";

export const Route = createFileRoute("/admin/login")({
  head: () => ({
    meta: [{ title: "Iniciar Sesión — Panel de Control | Tu Logo en mi Mac" }],
  }),
  component: AdminLogin,
});

function AdminLogin() {
  const { user, loading: authLoading, signIn, signUp } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isRegister, setIsRegister] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!authLoading && user) {
      navigate({ to: "/admin" });
    }
  }, [user, authLoading, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      toast.error("Por favor completa el correo y la contraseña.");
      return;
    }

    setSubmitting(true);
    try {
      if (isRegister) {
        await signUp(email.trim(), password.trim());
        toast.success("¡Cuenta de administrador creada exitosamente!");
      } else {
        await signIn(email.trim(), password.trim());
        toast.success("¡Bienvenido al panel!");
      }
      navigate({ to: "/admin" });
    } catch (err: unknown) {
      const error = err as { code?: string; message?: string };
      console.error("Auth error:", error);
      let message = "Error de autenticación. Verifica tus credenciales.";
      if (error.code === "auth/invalid-credential" || error.code === "auth/wrong-password") {
        message = "Credenciales incorrectas. Verifica tu correo y contraseña.";
      } else if (error.code === "auth/user-not-found") {
        message = "No existe una cuenta registrada con este correo.";
      } else if (error.code === "auth/email-already-in-use") {
        message = "Este correo electrónico ya está registrado. Intenta iniciar sesión.";
      } else if (error.code === "auth/weak-password") {
        message = "La contraseña debe tener al menos 6 caracteres.";
      } else if (error.code === "auth/invalid-email") {
        message = "El formato del correo electrónico no es válido.";
      }
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  };

  if (authLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4 py-12">
      <Toaster />

      <div className="w-full max-w-md space-y-6">
        <div className="text-center">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6"
          >
            <ArrowLeft className="h-4 w-4" />
            Volver a Tu Logo en mi Mac
          </Link>
          <div className="flex justify-center mb-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-secondary border border-border">
              <Laptop className="h-6 w-6 text-foreground" />
            </div>
          </div>
          <h1 className="text-2xl font-bold tracking-tight">Panel de Administración</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Gestiona los 18 espacios de stickers, precios y solicitudes entrantes.
          </p>
        </div>

        <Card className="border-border shadow-lg">
          <CardHeader>
            <CardTitle className="text-xl">
              {isRegister ? "Crear cuenta de administrador" : "Iniciar sesión"}
            </CardTitle>
            <CardDescription>
              {isRegister
                ? "Registra el correo de administrador para gestionar tu proyecto en Firebase."
                : "Ingresa tus credenciales para acceder al panel."}
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Correo electrónico</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="admin@tulogoenmimac.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-9"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Contraseña</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-9"
                    required
                  />
                </div>
              </div>
            </CardContent>

            <CardFooter className="flex flex-col gap-3 pt-2">
              <Button type="submit" className="w-full gap-2" disabled={submitting}>
                {submitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Procesando...
                  </>
                ) : isRegister ? (
                  <>
                    <KeyRound className="h-4 w-4" />
                    Registrar Administrador
                  </>
                ) : (
                  <>
                    <Lock className="h-4 w-4" />
                    Entrar al Panel
                  </>
                )}
              </Button>

              <button
                type="button"
                onClick={() => setIsRegister(!isRegister)}
                className="text-xs text-muted-foreground hover:text-foreground underline transition-colors"
              >
                {isRegister
                  ? "¿Ya tienes cuenta? Inicia sesión aquí"
                  : "¿No tienes cuenta aún? Crear cuenta de administrador"}
              </button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
}
