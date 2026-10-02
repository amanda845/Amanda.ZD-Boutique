import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useAuth } from "@/hooks/use-auth";
import { Loader2, Lock, ShieldAlert } from "lucide-react";
import type { ReactNode } from "react";
import { Navigate, useLocation, useNavigate } from "react-router";

/**
 * Protège une route nécessitant un utilisateur ou un client connecté.
 *
 * - Pour /mon-compte : autorise si useAuth().isAuthenticated OU si client_id_session existe dans localStorage.
 * - Pour /admin (requireAdmin=true) : autorise UNIQUEMENT si user?.role === 'admin'.
 */
export function RequireAuth({
  children,
  title = "Connectez-vous pour continuer",
  description = "Cette page est réservée aux clientes connectées.",
  redirectImmediately = false,
  requireAdmin = false,
}: {
  children: ReactNode;
  title?: string;
  description?: string;
  redirectImmediately?: boolean;
  requireAdmin?: boolean;
}) {
  const { isLoading, isAuthenticated, isAdmin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Vérifier également la session par identifiant client (ex: 123456)
  const hasClientIdSession =
    typeof window !== "undefined" &&
    !!localStorage.getItem("client_id_session");

  // Pendant le chargement initial de l'authentification
  if (isLoading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 className="size-6 animate-spin text-muted-foreground" />
      </main>
    );
  }

  // Route Admin : requiert strictement le rôle admin
  if (requireAdmin) {
    if (!isAuthenticated || !isAdmin) {
      return (
        <main className="flex min-h-screen items-center justify-center bg-[#FAF8F5] p-6">
          <Card className="w-full max-w-md border-border/70 shadow-sm bg-white">
            <CardHeader className="text-center">
              <div className="flex justify-center">
                <div className="mb-4 flex size-12 items-center justify-center rounded-full bg-destructive/10">
                  <ShieldAlert className="size-5 text-destructive" />
                </div>
              </div>
              <CardTitle className="font-serif text-xl">Accès Administrateur Restreint</CardTitle>
              <CardDescription>
                Cette zone est exclusivement réservée à l'administration de la boutique Amanda.ZD.
              </CardDescription>
            </CardHeader>
            <CardFooter className="flex flex-col gap-2">
              <Button
                className="w-full bg-black text-white hover:bg-neutral-800"
                onClick={() => navigate("/auth?tab=admin")}
              >
                Se connecter en tant qu'Admin
              </Button>
              <Button
                variant="ghost"
                className="w-full"
                onClick={() => navigate("/")}
              >
                Retour à la boutique
              </Button>
            </CardFooter>
          </Card>
        </main>
      );
    }
    return <>{children}</>;
  }

  // Route Client (/mon-compte) : autorisée si connecté OU si identifiant client actif
  if (!isAuthenticated && !hasClientIdSession) {
    const returnTo = `${location.pathname}${location.search}`;
    const signInHref = `/auth?returnTo=${encodeURIComponent(returnTo)}`;

    if (redirectImmediately) {
      return <Navigate to={signInHref} replace />;
    }

    return (
      <main className="flex min-h-screen items-center justify-center bg-[#FAF8F5] p-6">
        <Card className="w-full max-w-md border-border/70 shadow-sm bg-white">
          <CardHeader className="text-center">
            <div className="flex justify-center">
              <div className="mb-4 flex size-12 items-center justify-center rounded-full bg-[#C5A880]/15">
                <Lock className="size-5 text-[#C5A880]" />
              </div>
            </div>
            <CardTitle className="font-serif text-xl">{title}</CardTitle>
            <CardDescription>{description}</CardDescription>
          </CardHeader>
          <CardContent className="text-center text-sm text-muted-foreground">
            Connectez-vous avec votre identifiant client ou votre compte pour accéder à vos commandes.
          </CardContent>
          <CardFooter className="flex flex-col gap-2">
            <Button
              className="w-full bg-[#C5A880] text-white hover:bg-[#b0936b]"
              onClick={() => navigate(signInHref)}
            >
              Accéder à l'authentification
            </Button>
            <Button
              variant="ghost"
              className="w-full"
              onClick={() => navigate("/")}
            >
              Retour à la boutique
            </Button>
          </CardFooter>
        </Card>
      </main>
    );
  }

  return <>{children}</>;
}

export default RequireAuth;