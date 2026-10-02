import { SiteFooter } from "@/components/shop/SiteFooter";
import { SiteHeader } from "@/components/shop/SiteHeader";
import { useCurrency } from "@/components/shop/currency";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useAuth } from "@/hooks/use-auth";
import { useCart, type Order } from "@/hooks/use-cart";
import { formatPrice } from "@/lib/products";
import {
  CalendarDays,
  Heart,
  LogOut,
  MapPin,
  MoveRight,
  Package,
  ShieldCheck,
  Sparkles,
  UserRound,
} from "lucide-react";
import { Link, useNavigate } from "react-router";

const STATUS_LABELS: Record<Order["status"], { label: string; variant: "default" | "secondary" | "destructive" | "outline" }> = {
  "en-preparation": { label: "En préparation", variant: "secondary" },
  "expediee": { label: "Expédiée", variant: "default" },
  "livree": { label: "Livrée", variant: "outline" },
  "annulee": { label: "Annulée", variant: "destructive" },
};

export default function MonCompte() {
  const { user, isAdmin, signOut } = useAuth();
  const { currency } = useCurrency();
  const { getOrdersForUser, getAllOrders } = useCart();
  const navigate = useNavigate();

  const clientIdSession =
    typeof window !== "undefined"
      ? localStorage.getItem("client_id_session")
      : null;

  const handleSignOut = async () => {
    try {
      if (typeof window !== "undefined") {
        localStorage.removeItem("client_id_session");
      }
      await signOut();
      navigate("/");
    } catch (error) {
      console.error("Sign out error:", error);
    }
  };

  const displayName =
    user?.name ||
    user?.email ||
    (clientIdSession ? `Cliente #${clientIdSession}` : "Cliente");

  const effectiveUserId = user?.id || clientIdSession;
  const userOrders = effectiveUserId ? getOrdersForUser(effectiveUserId) : [];

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />

      <main className="flex-1">
        {/* Hero */}
        <section className="border-b border-border/70 bg-secondary/40">
          <div className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6">
            <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
              Votre espace
            </p>
            <h1 className="mt-2 font-display text-4xl font-semibold text-foreground sm:text-5xl">
              Bonjour, <span className="italic text-gold">{displayName}</span>
            </h1>
            <p className="mt-3 max-w-xl text-sm leading-relaxed text-muted-foreground">
              Votre compte Boutique Amanda.ZD est actif. Bonne visite dans la collection.
            </p>
            {isAdmin && (
              <Button
                onClick={() => navigate("/admin")}
                className="mt-4 gap-2 uppercase tracking-[0.12em] text-xs"
              >
                <ShieldCheck className="size-4" />
                Accéder au panel Admin
              </Button>
            )}
          </div>
        </section>

        <section className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6">
          {/* Info cards */}
          <div className="grid gap-6 md:grid-cols-3">
            <Card className="border-border/70 shadow-none">
              <CardHeader>
                <div className="mb-3 flex size-10 items-center justify-center rounded-full bg-secondary text-gold">
                  <UserRound className="size-5" />
                </div>
                <CardTitle className="font-display text-xl">Profil</CardTitle>
              </CardHeader>
              <CardContent className="space-y-1.5 text-sm text-muted-foreground">
                <p className="text-foreground">{displayName}</p>
                {user?.email && <p>{user.email}</p>}
                <p className="pt-2 text-xs uppercase tracking-[0.12em]">
                  {isAdmin ? "Administratrice" : "Cliente enregistrée"}
                </p>
              </CardContent>
            </Card>

            <Card className="border-border/70 shadow-none">
              <CardHeader>
                <div className="mb-3 flex size-10 items-center justify-center rounded-full bg-secondary text-gold">
                  <Sparkles className="size-5" />
                </div>
                <CardTitle className="font-display text-xl">
                  Préférences
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-1.5 text-sm text-muted-foreground">
                <p>
                  Devise d'affichage :{" "}
                  <span className="text-foreground">{currency}</span>
                </p>
                <p className="text-xs leading-relaxed">
                  Les prix du catalogue s'affichent dans cette devise. Livraison
                  internationale suivie sur toutes les commandes.
                </p>
              </CardContent>
            </Card>

            <Card className="border-border/70 shadow-none">
              <CardHeader>
                <div className="mb-3 flex size-10 items-center justify-center rounded-full bg-secondary text-gold">
                  <Heart className="size-5" />
                </div>
                <CardTitle className="font-display text-xl">
                  Boutique
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-muted-foreground">
                <p className="flex items-start gap-2">
                  <Package className="mt-0.5 size-4 shrink-0" />
                  Découvrez nos nouveautés et ajoutez vos coups de cœur au panier.
                </p>
                <Button asChild variant="outline" size="sm" className="gap-2">
                  <Link to="/boutique">
                    Continuer mes achats
                    <MoveRight className="size-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Historique des commandes */}
          <div className="mt-12">
            <h2 className="font-display text-2xl font-semibold text-foreground mb-6">
              Mes commandes
            </h2>

            {userOrders.length === 0 ? (
              <Card className="border-border/70 shadow-none">
                <CardContent className="py-12 text-center">
                  <Package className="mx-auto size-10 text-muted-foreground/40" />
                  <p className="mt-4 font-display text-lg text-foreground">
                    Aucune commande pour le moment
                  </p>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Explorez notre collection et passez votre première commande !
                  </p>
                  <Button asChild className="mt-6 gap-2">
                    <Link to="/boutique">
                      Découvrir la collection
                      <MoveRight className="size-4" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {userOrders.map((order) => {
                  const statusInfo = STATUS_LABELS[order.status];
                  return (
                    <Card key={order.id} className="border-border/70 shadow-none">
                      <CardHeader className="pb-3">
                        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                          <div className="space-y-1">
                            <CardTitle className="font-display text-lg">
                              Commande {order.id}
                            </CardTitle>
                            <div className="flex items-center gap-3 text-xs text-muted-foreground">
                              <span className="flex items-center gap-1">
                                <CalendarDays className="size-3" />
                                {new Date(order.createdAt).toLocaleDateString("fr-FR", {
                                  day: "numeric",
                                  month: "long",
                                  year: "numeric",
                                })}
                              </span>
                              <span className="flex items-center gap-1">
                                <MapPin className="size-3" />
                                {order.shippingAddress.city}, {order.shippingAddress.country}
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <Badge variant={statusInfo.variant}>
                              {statusInfo.label}
                            </Badge>
                            <span className="text-sm font-semibold text-foreground">
                              {formatPrice(order.totalEur, currency)}
                            </span>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="divide-y divide-border/50">
                          {order.items.map((item, idx) => (
                            <div key={idx} className="flex items-center gap-4 py-3 first:pt-0 last:pb-0">
                              <img
                                src={item.product.imageUrl}
                                alt={item.product.name}
                                className="size-14 rounded object-cover bg-secondary"
                              />
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-foreground truncate">
                                  {item.product.name}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  Taille {item.selectedSize} · {item.selectedColor} · x{item.quantity}
                                </p>
                              </div>
                              <p className="text-sm text-foreground whitespace-nowrap">
                                {formatPrice(item.product.priceEur * item.quantity, currency)}
                              </p>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}
          </div>

          {/* Déconnexion */}
          <div className="mt-10">
            <Button
              variant="ghost"
              onClick={handleSignOut}
              className="gap-2 text-muted-foreground hover:text-foreground"
            >
              <LogOut className="size-4" />
              Se déconnecter
            </Button>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
