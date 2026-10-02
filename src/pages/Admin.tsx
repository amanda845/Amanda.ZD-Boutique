import { SiteFooter } from "@/components/shop/SiteFooter";
import { SiteHeader } from "@/components/shop/SiteHeader";
import { useCurrency } from "@/components/shop/currency";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/hooks/use-auth";
import { useCart, type Order } from "@/hooks/use-cart";
import {
  CATEGORY_LABELS,
  CATEGORY_ORDER,
  DEFAULT_PRODUCTS,
  formatPrice,
  type Product,
} from "@/lib/products";
import {
  CalendarDays,
  ClipboardList,
  Edit3,
  MapPin,
  Package,
  Plus,
  Save,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  TrendingUp,
  Users,
  X,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router";
import { toast } from "sonner";

const STATUS_OPTIONS: { value: Order["status"]; label: string }[] = [
  { value: "en-preparation", label: "En préparation" },
  { value: "expediee", label: "Expédiée" },
  { value: "livree", label: "Livrée" },
  { value: "annulee", label: "Annulée" },
];

const STATUS_BADGES: Record<Order["status"], { label: string; variant: "default" | "secondary" | "destructive" | "outline" }> = {
  "en-preparation": { label: "En préparation", variant: "secondary" },
  "expediee": { label: "Expédiée", variant: "default" },
  "livree": { label: "Livrée", variant: "outline" },
  "annulee": { label: "Annulée", variant: "destructive" },
};

// Products store with localStorage persistence
const PRODUCTS_KEY = "amanda-products";

function getStoredProducts(): Product[] {
  try {
    const raw = localStorage.getItem(PRODUCTS_KEY);
    if (raw) return JSON.parse(raw);
  } catch {
    // ignore
  }
  // Initialize with defaults
  localStorage.setItem(PRODUCTS_KEY, JSON.stringify(DEFAULT_PRODUCTS));
  return [...DEFAULT_PRODUCTS];
}

function saveProducts(products: Product[]) {
  localStorage.setItem(PRODUCTS_KEY, JSON.stringify(products));
}

export default function Admin() {
  const { user, isAdmin } = useAuth();
  const { currency } = useCurrency();
  const { getAllOrders, updateOrderStatus } = useCart();
  const navigate = useNavigate();

  const [products, setProducts] = useState<Product[]>(getStoredProducts);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);

  // Redirect if not admin
  useEffect(() => {
    if (!isAdmin) {
      navigate("/mon-compte");
    }
  }, [isAdmin, navigate]);

  const orders = getAllOrders();

  // Stats
  const stats = useMemo(() => {
    const totalRevenue = orders.reduce((sum, o) => sum + o.totalEur, 0);
    const activeOrders = orders.filter((o) => o.status !== "annulee" && o.status !== "livree").length;
    const uniqueClients = new Set(orders.map((o) => o.userId)).size;
    return { totalRevenue, totalOrders: orders.length, activeOrders, uniqueClients };
  }, [orders]);

  const handleStatusChange = (orderId: string, status: Order["status"]) => {
    updateOrderStatus(orderId, status);
    toast.success("Statut mis à jour", {
      description: `Commande ${orderId} → ${STATUS_BADGES[status].label}`,
    });
  };

  const handleToggleNew = (productId: string) => {
    setProducts((prev) => {
      const updated = prev.map((p) =>
        (p.id || p._id) === productId ? { ...p, isNew: !p.isNew } : p,
      );
      saveProducts(updated);
      return updated;
    });
    toast.success("Produit mis à jour");
  };

  const handleSaveProduct = (product: Product) => {
    setProducts((prev) => {
      const pid = product.id || product._id;
      const exists = prev.some((p) => (p.id || p._id) === pid);
      let updated: Product[];
      if (exists) {
        updated = prev.map((p) => ((p.id || p._id) === pid ? product : p));
      } else {
        updated = [...prev, product];
      }
      saveProducts(updated);
      return updated;
    });
    setEditingProduct(null);
    setShowAddForm(false);
    toast.success(editingProduct ? "Produit modifié" : "Produit ajouté");
  };

  if (!isAdmin) return null;

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />

      <main className="flex-1">
        {/* Hero Admin */}
        <section className="border-b border-border/70 bg-primary text-primary-foreground">
          <div className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6">
            <div className="flex items-center gap-3">
              <ShieldCheck className="size-6" />
              <p className="text-xs uppercase tracking-[0.2em] text-primary-foreground/70">
                Administration
              </p>
            </div>
            <h1 className="mt-2 font-display text-4xl font-semibold sm:text-5xl">
              Tableau de bord <span className="italic">Amanda.ZD</span>
            </h1>
            <p className="mt-3 max-w-xl text-sm leading-relaxed text-primary-foreground/80">
              Gérez les commandes, suivez les ventes et administrez le catalogue de la boutique.
            </p>
          </div>
        </section>

        <section className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6">
          {/* Stats cards */}
          <div className="grid gap-4 md:grid-cols-4 mb-8">
            <Card className="border-border/70 shadow-none">
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <div className="flex size-10 items-center justify-center rounded-full bg-secondary text-gold">
                    <TrendingUp className="size-5" />
                  </div>
                  <div>
                    <p className="text-2xl font-semibold text-foreground">{formatPrice(stats.totalRevenue, currency)}</p>
                    <p className="text-xs text-muted-foreground">Chiffre d'affaires</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="border-border/70 shadow-none">
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <div className="flex size-10 items-center justify-center rounded-full bg-secondary text-gold">
                    <ClipboardList className="size-5" />
                  </div>
                  <div>
                    <p className="text-2xl font-semibold text-foreground">{stats.totalOrders}</p>
                    <p className="text-xs text-muted-foreground">Commandes totales</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="border-border/70 shadow-none">
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <div className="flex size-10 items-center justify-center rounded-full bg-secondary text-gold">
                    <Package className="size-5" />
                  </div>
                  <div>
                    <p className="text-2xl font-semibold text-foreground">{stats.activeOrders}</p>
                    <p className="text-xs text-muted-foreground">En cours</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="border-border/70 shadow-none">
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <div className="flex size-10 items-center justify-center rounded-full bg-secondary text-gold">
                    <Users className="size-5" />
                  </div>
                  <div>
                    <p className="text-2xl font-semibold text-foreground">{stats.uniqueClients}</p>
                    <p className="text-xs text-muted-foreground">Clients uniques</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main tabs */}
          <Tabs defaultValue="orders" className="w-full">
            <TabsList className="mb-6">
              <TabsTrigger value="orders" className="gap-2">
                <ShoppingBag className="size-4" />
                Commandes
              </TabsTrigger>
              <TabsTrigger value="products" className="gap-2">
                <Sparkles className="size-4" />
                Produits
              </TabsTrigger>
            </TabsList>

            {/* Orders Tab */}
            <TabsContent value="orders">
              <Card className="border-border/70 shadow-none">
                <CardHeader>
                  <CardTitle className="font-display text-xl">Toutes les commandes</CardTitle>
                  <CardDescription>
                    Consultez et gérez le statut de l'ensemble des commandes clients.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {orders.length === 0 ? (
                    <div className="py-12 text-center">
                      <Package className="mx-auto size-10 text-muted-foreground/40" />
                      <p className="mt-4 font-display text-lg text-foreground">
                        Aucune commande pour le moment
                      </p>
                      <p className="mt-2 text-sm text-muted-foreground">
                        Les commandes apparaîtront ici dès que les clients passeront leurs premiers achats.
                      </p>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>N° Commande</TableHead>
                            <TableHead>Client</TableHead>
                            <TableHead>Articles</TableHead>
                            <TableHead>Total</TableHead>
                            <TableHead>Date</TableHead>
                            <TableHead>Adresse</TableHead>
                            <TableHead>Statut</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {orders.map((order) => {
                            const statusInfo = STATUS_BADGES[order.status];
                            return (
                              <TableRow key={order.id}>
                                <TableCell className="font-medium text-foreground">
                                  {order.id}
                                </TableCell>
                                <TableCell>
                                  <div>
                                    <p className="text-sm text-foreground">{order.shippingAddress.name}</p>
                                    <p className="text-xs text-muted-foreground">{order.userId.slice(0, 12)}…</p>
                                  </div>
                                </TableCell>
                                <TableCell>
                                  <div className="space-y-1">
                                    {order.items.map((item, idx) => (
                                      <p key={idx} className="text-xs text-muted-foreground">
                                        {item.product.name} ×{item.quantity}
                                      </p>
                                    ))}
                                  </div>
                                </TableCell>
                                <TableCell className="font-medium">
                                  {formatPrice(order.totalEur, currency)}
                                </TableCell>
                                <TableCell>
                                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                    <CalendarDays className="size-3" />
                                    {new Date(order.createdAt).toLocaleDateString("fr-FR", {
                                      day: "2-digit",
                                      month: "2-digit",
                                      year: "numeric",
                                    })}
                                  </div>
                                </TableCell>
                                <TableCell>
                                  <div className="flex items-start gap-1 text-xs text-muted-foreground">
                                    <MapPin className="size-3 mt-0.5 shrink-0" />
                                    <span>
                                      {order.shippingAddress.address}, {order.shippingAddress.postalCode} {order.shippingAddress.city}, {order.shippingAddress.country}
                                    </span>
                                  </div>
                                </TableCell>
                                <TableCell>
                                  <Select
                                    value={order.status}
                                    onValueChange={(v) => handleStatusChange(order.id, v as Order["status"])}
                                  >
                                    <SelectTrigger className="h-8 w-[160px]">
                                      <Badge variant={statusInfo.variant} className="text-[10px]">
                                        {statusInfo.label}
                                      </Badge>
                                    </SelectTrigger>
                                    <SelectContent>
                                      {STATUS_OPTIONS.map((opt) => (
                                        <SelectItem key={opt.value} value={opt.value}>
                                          {opt.label}
                                        </SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                </TableCell>
                              </TableRow>
                            );
                          })}
                        </TableBody>
                      </Table>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Products Tab */}
            <TabsContent value="products">
              <Card className="border-border/70 shadow-none">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="font-display text-xl">Gestion du catalogue</CardTitle>
                      <CardDescription>
                        Ajoutez, modifiez et marquez les produits comme « Nouveauté ».
                      </CardDescription>
                    </div>
                    <Button
                      onClick={() => {
                        setShowAddForm(true);
                        setEditingProduct(null);
                      }}
                      className="gap-2"
                    >
                      <Plus className="size-4" />
                      Ajouter un article
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  {(showAddForm || editingProduct) && (
                    <ProductForm
                      product={editingProduct}
                      onSave={handleSaveProduct}
                      onCancel={() => {
                        setEditingProduct(null);
                        setShowAddForm(false);
                      }}
                    />
                  )}

                  <div className="overflow-x-auto mt-4">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Image</TableHead>
                          <TableHead>Nom</TableHead>
                          <TableHead>Catégorie</TableHead>
                          <TableHead>Prix</TableHead>
                          <TableHead>Stock</TableHead>
                          <TableHead>Nouveauté</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {products.map((product) => {
                          const pid = product.id || product._id || product.name;
                          return (
                            <TableRow key={pid}>
                              <TableCell>
                                <img
                                  src={product.imageUrl}
                                  alt={product.name}
                                  className="size-12 rounded object-cover bg-secondary"
                                />
                              </TableCell>
                              <TableCell className="font-medium text-foreground">
                                {product.name}
                              </TableCell>
                              <TableCell className="text-sm text-muted-foreground">
                                {CATEGORY_LABELS[product.category]}
                              </TableCell>
                              <TableCell>{formatPrice(product.priceEur, currency)}</TableCell>
                              <TableCell>{product.stock ?? "∞"}</TableCell>
                              <TableCell>
                                <Switch
                                  checked={product.isNew}
                                  onCheckedChange={() => handleToggleNew(pid)}
                                />
                              </TableCell>
                              <TableCell>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="gap-1"
                                  onClick={() => {
                                    setEditingProduct(product);
                                    setShowAddForm(false);
                                  }}
                                >
                                  <Edit3 className="size-3.5" />
                                  Modifier
                                </Button>
                              </TableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}

/** Formulaire d'ajout / modification de produit */
function ProductForm({
  product,
  onSave,
  onCancel,
}: {
  product: Product | null;
  onSave: (p: Product) => void;
  onCancel: () => void;
}) {
  const [name, setName] = useState(product?.name ?? "");
  const [description, setDescription] = useState(product?.description ?? "");
  const [category, setCategory] = useState<Product["category"]>(product?.category ?? "robes");
  const [priceEur, setPriceEur] = useState(product?.priceEur?.toString() ?? "");
  const [sizes, setSizes] = useState(product?.sizes?.join(", ") ?? "S, M, L");
  const [colors, setColors] = useState(product?.colors?.join(", ") ?? "");
  const [imageUrl, setImageUrl] = useState(product?.imageUrl ?? "");
  const [stock, setStock] = useState(product?.stock?.toString() ?? "10");
  const [isNew, setIsNew] = useState(product?.isNew ?? false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const p: Product = {
      id: product?.id || product?._id || `prod-${Date.now()}`,
      name: name.trim(),
      description: description.trim(),
      category,
      priceEur: parseFloat(priceEur) || 0,
      sizes: sizes.split(",").map((s) => s.trim()).filter(Boolean),
      colors: colors.split(",").map((s) => s.trim()).filter(Boolean),
      imageUrl: imageUrl.trim() || "https://images.unsplash.com/photo-1558618666-fcd25c85f82e?auto=format&fit=crop&w=900&q=80",
      isNew,
      isActive: true,
      stock: parseInt(stock) || 0,
    };
    onSave(p);
  };

  return (
    <Card className="border-gold/30 bg-secondary/30 mb-6">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="font-display text-lg">
            {product ? "Modifier l'article" : "Nouvel article"}
          </CardTitle>
          <Button variant="ghost" size="sm" onClick={onCancel}>
            <X className="size-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="grid gap-4 md:grid-cols-2">
          <div className="space-y-1.5">
            <Label className="text-xs">Nom du produit</Label>
            <Input value={name} onChange={(e) => setName(e.target.value)} required />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">Catégorie</Label>
            <Select value={category} onValueChange={(v) => setCategory(v as Product["category"])}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {CATEGORY_ORDER.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {CATEGORY_LABELS[cat]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5 md:col-span-2">
            <Label className="text-xs">Description</Label>
            <Input value={description} onChange={(e) => setDescription(e.target.value)} required />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">Prix (EUR)</Label>
            <Input type="number" min="0" step="0.01" value={priceEur} onChange={(e) => setPriceEur(e.target.value)} required />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">Stock</Label>
            <Input type="number" min="0" value={stock} onChange={(e) => setStock(e.target.value)} />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">Tailles (séparées par des virgules)</Label>
            <Input value={sizes} onChange={(e) => setSizes(e.target.value)} placeholder="XS, S, M, L, XL" />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">Couleurs (séparées par des virgules)</Label>
            <Input value={colors} onChange={(e) => setColors(e.target.value)} placeholder="Noir, Blanc" />
          </div>
          <div className="space-y-1.5 md:col-span-2">
            <Label className="text-xs">URL de l'image</Label>
            <Input value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} placeholder="https://..." />
          </div>
          <div className="flex items-center gap-3">
            <Switch checked={isNew} onCheckedChange={setIsNew} />
            <Label className="text-xs">Marquer comme Nouveauté</Label>
          </div>
          <div className="flex justify-end md:col-span-2">
            <Button type="submit" className="gap-2">
              <Save className="size-4" />
              {product ? "Enregistrer les modifications" : "Ajouter au catalogue"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
