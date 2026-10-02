import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/hooks/use-auth";
import { Heart, LogOut, Package } from "lucide-react";
import { useNavigate } from "react-router";

/**
 * Ancienne route /dashboard — remplacée par /mon-compte.
 * Redirige les anciens liens et propose l'espace client.
 */
export default function Dashboard() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  return (
    <main className="min-h-screen bg-background px-6 py-10 text-foreground">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-8">
        <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">
              Espace client Boutique Amanda.ZD
            </p>
            <h1 className="mt-1 font-display text-3xl font-semibold tracking-tight">
              Bienvenue{user?.name ? `, ${user.name}` : ""}
            </h1>
          </div>
          <Button
            type="button"
            variant="outline"
            className="self-start gap-2"
            onClick={handleSignOut}
          >
            <LogOut className="size-4" />
            Se déconnecter
          </Button>
        </header>

        <Card className="border-border/70 shadow-none">
          <CardHeader>
            <CardTitle className="font-display text-xl">
              Cette page devient « Mon compte »
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-4 text-sm leading-6 text-muted-foreground">
            <p className="flex items-center gap-2">
              <Heart className="size-4 text-gold" />
              Vos favoris et préférences se retrouveront dans votre espace
              client.
            </p>
            <p className="flex items-center gap-2">
              <Package className="size-4 text-gold" />
              Le suivi de commandes arrive prochainement.
            </p>
            <Button className="w-fit" onClick={() => navigate("/mon-compte")}>
              Aller à Mon compte
            </Button>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
