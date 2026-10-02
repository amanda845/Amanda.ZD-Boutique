import { SiteFooter } from "@/components/shop/SiteFooter";
import { SiteHeader } from "@/components/shop/SiteHeader";
import { useCurrency } from "@/components/shop/currency";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/use-auth";
import { useCart } from "@/hooks/use-cart";
import { formatPrice } from "@/lib/products";
import {
  ArrowRight,
  Loader2,
  Minus,
  MoveRight,
  Package,
  Plus,
  ShoppingBag,
  Trash2,
} from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { toast } from "sonner";

export default function Panier() {
  const { currency } = useCurrency();
  const { user, isAuthenticated } = useAuth();
  const { items, removeItem, updateQuantity, clearCart, itemCount, totalEur, formatTotal, placeOrder } = useCart();
  const navigate = useNavigate();

  const [showCheckout, setShowCheckout] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Shipping form
  const [shippingName, setShippingName] = useState(user?.name ?? "");
  const [shippingAddress, setShippingAddress] = useState("");
  const [shippingCity, setShippingCity] = useState("");
  const [shippingPostalCode, setShippingPostalCode] = useState("");
  const [shippingCountry, setShippingCountry] = useState("France");

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setIsSubmitting(true);

    try {
      // Simulate a small delay for realism
      await new Promise((r) => setTimeout(r, 800));
      const order = placeOrder(user.id, {
        name: shippingName,
        address: shippingAddress,
        city: shippingCity,
        postalCode: shippingPostalCode,
        country: shippingCountry,
      });
      toast.success("Commande confirmée ! 🎉", {
        description: `Commande ${order.id} — ${formatPrice(order.totalEur, currency)}`,
      });
      navigate("/mon-compte");
    } catch {
      toast.error("Erreur lors de la commande");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />

      <main className="flex-1">
        {/* Hero */}
        <section className="border-b border-border/70 bg-secondary/40">
          <div className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6">
            <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
              Mon panier
            </p>
            <h1 className="mt-2 font-display text-4xl font-semibold text-foreground sm:text-5xl">
              Votre <span className="italic text-gold">sélection</span>
            </h1>
            {itemCount > 0 && (
              <p className="mt-3 text-sm text-muted-foreground">
                {itemCount} article{itemCount > 1 ? "s" : ""} · {formatTotal(currency)}
              </p>
            )}
          </div>
        </section>

        <section className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6">
          {items.length === 0 ? (
            <div className="flex flex-col items-center gap-4 py-20 text-center">
              <ShoppingBag className="size-12 text-muted-foreground/40" />
              <p className="font-display text-2xl text-foreground">
                Votre panier est vide
              </p>
              <p className="text-sm text-muted-foreground max-w-md">
                Parcourez notre collection et ajoutez vos coups de cœur.
              </p>
              <Button asChild className="mt-4 gap-2">
                <Link to="/boutique">
                  Découvrir la collection
                  <MoveRight className="size-4" />
                </Link>
              </Button>
            </div>
          ) : (
            <div className="grid gap-8 lg:grid-cols-3">
              {/* Item list */}
              <div className="lg:col-span-2 space-y-4">
                {items.map((item) => {
                  const pid = item.product.id || item.product._id || item.product.name;
                  return (
                    <Card key={`${pid}-${item.selectedSize}-${item.selectedColor}`} className="border-border/70 shadow-none">
                      <CardContent className="p-4">
                        <div className="flex gap-4">
                          <img
                            src={item.product.imageUrl}
                            alt={item.product.name}
                            className="w-24 h-32 rounded object-cover bg-secondary shrink-0"
                          />
                          <div className="flex-1 min-w-0 flex flex-col justify-between">
                            <div>
                              <h3 className="font-display text-lg font-semibold text-foreground truncate">
                                {item.product.name}
                              </h3>
                              <p className="text-xs text-muted-foreground mt-1">
                                Taille {item.selectedSize} · {item.selectedColor}
                              </p>
                              <p className="text-sm font-medium text-foreground mt-2">
                                {formatPrice(item.product.priceEur, currency)}
                              </p>
                            </div>
                            <div className="flex items-center justify-between mt-3">
                              <div className="flex items-center gap-2">
                                <button
                                  type="button"
                                  onClick={() => updateQuantity(pid, item.selectedSize, item.selectedColor, item.quantity - 1)}
                                  className="flex size-8 items-center justify-center rounded-md border border-border/70 text-muted-foreground hover:text-foreground transition-colors"
                                >
                                  <Minus className="size-3.5" />
                                </button>
                                <span className="w-8 text-center text-sm font-medium text-foreground">
                                  {item.quantity}
                                </span>
                                <button
                                  type="button"
                                  onClick={() => updateQuantity(pid, item.selectedSize, item.selectedColor, item.quantity + 1)}
                                  className="flex size-8 items-center justify-center rounded-md border border-border/70 text-muted-foreground hover:text-foreground transition-colors"
                                >
                                  <Plus className="size-3.5" />
                                </button>
                              </div>
                              <div className="flex items-center gap-3">
                                <span className="text-sm font-semibold text-foreground">
                                  {formatPrice(item.product.priceEur * item.quantity, currency)}
                                </span>
                                <button
                                  type="button"
                                  onClick={() => removeItem(pid, item.selectedSize, item.selectedColor)}
                                  className="text-muted-foreground hover:text-destructive transition-colors"
                                >
                                  <Trash2 className="size-4" />
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}

                <Button variant="ghost" onClick={clearCart} className="text-xs text-muted-foreground gap-1">
                  <Trash2 className="size-3.5" />
                  Vider le panier
                </Button>
              </div>

              {/* Summary / Checkout */}
              <div className="lg:col-span-1">
                <Card className="border-border/70 shadow-none sticky top-[140px]">
                  <CardHeader>
                    <CardTitle className="font-display text-xl">Récapitulatif</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Sous-total</span>
                        <span className="text-foreground">{formatTotal(currency)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Livraison</span>
                        <span className="text-foreground text-gold">Offerte</span>
                      </div>
                      <div className="border-t border-border/70 pt-2 flex justify-between">
                        <span className="font-medium text-foreground">Total</span>
                        <span className="font-semibold text-foreground text-lg">
                          {formatTotal(currency)}
                        </span>
                      </div>
                    </div>

                    {!isAuthenticated ? (
                      <div className="space-y-3">
                        <p className="text-xs text-muted-foreground text-center">
                          Connectez-vous pour finaliser votre commande.
                        </p>
                        <Button
                          className="w-full gap-2"
                          onClick={() => navigate("/auth?returnTo=/panier")}
                        >
                          Se connecter
                          <ArrowRight className="size-4" />
                        </Button>
                      </div>
                    ) : !showCheckout ? (
                      <Button className="w-full gap-2" onClick={() => setShowCheckout(true)}>
                        Passer commande
                        <ArrowRight className="size-4" />
                      </Button>
                    ) : (
                      <form onSubmit={handleCheckout} className="space-y-3">
                        <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                          Adresse de livraison
                        </p>
                        <div className="space-y-2">
                          <div>
                            <Label htmlFor="ship-name" className="text-xs">Nom complet</Label>
                            <Input id="ship-name" value={shippingName} onChange={(e) => setShippingName(e.target.value)} required />
                          </div>
                          <div>
                            <Label htmlFor="ship-addr" className="text-xs">Adresse</Label>
                            <Input id="ship-addr" value={shippingAddress} onChange={(e) => setShippingAddress(e.target.value)} placeholder="12 rue de la Paix" required />
                          </div>
                          <div className="grid grid-cols-2 gap-2">
                            <div>
                              <Label htmlFor="ship-cp" className="text-xs">Code postal</Label>
                              <Input id="ship-cp" value={shippingPostalCode} onChange={(e) => setShippingPostalCode(e.target.value)} required />
                            </div>
                            <div>
                              <Label htmlFor="ship-city" className="text-xs">Ville</Label>
                              <Input id="ship-city" value={shippingCity} onChange={(e) => setShippingCity(e.target.value)} required />
                            </div>
                          </div>
                          <div>
                            <Label htmlFor="ship-country" className="text-xs">Pays</Label>
                            <Input id="ship-country" value={shippingCountry} onChange={(e) => setShippingCountry(e.target.value)} required />
                          </div>
                        </div>
                        <Button type="submit" className="w-full gap-2" disabled={isSubmitting}>
                          {isSubmitting ? (
                            <>
                              <Loader2 className="size-4 animate-spin" />
                              Traitement…
                            </>
                          ) : (
                            <>
                              <Package className="size-4" />
                              Confirmer la commande — {formatTotal(currency)}
                            </>
                          )}
                        </Button>
                      </form>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          )}
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
