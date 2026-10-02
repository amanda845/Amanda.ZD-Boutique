import { ProductCard } from "@/components/shop/ProductCard";
import { SiteFooter } from "@/components/shop/SiteFooter";
import { SiteHeader } from "@/components/shop/SiteHeader";
import { useCurrency } from "@/components/shop/currency";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { CATEGORY_LABELS, CATEGORY_ORDER, DEFAULT_PRODUCTS } from "@/lib/products";
import type { Product } from "@/lib/products";
import { MoveRight, PackageSearch } from "lucide-react";
import { useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router";

type SortKey = "nouveautes" | "prix-asc" | "prix-desc" | "nom";

const SORT_LABELS: Record<SortKey, string> = {
  nouveautes: "Nouveautés d'abord",
  "prix-asc": "Prix croissant",
  "prix-desc": "Prix décroissant",
  nom: "Nom (A–Z)",
};

function ProductGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 gap-x-5 gap-y-10 md:grid-cols-3 xl:grid-cols-4">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="space-y-3">
          <Skeleton className="aspect-[3/4] w-full rounded-none" />
          <Skeleton className="h-3 w-16" />
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-3 w-12" />
        </div>
      ))}
    </div>
  );
}

export default function Boutique() {
  const { currency } = useCurrency();
  const [searchParams, setSearchParams] = useSearchParams();
  const activeCategory = (searchParams.get("categorie") ?? "toutes") as
    | "toutes"
    | (typeof CATEGORY_ORDER)[number];

  const [sort, setSort] = useState<SortKey>("nouveautes");

  const products = DEFAULT_PRODUCTS;

  const filtered = useMemo(() => {
    if (!products) return [];
    let list = [...products];
    if (activeCategory !== "toutes") {
      list = list.filter((p) => p.category === activeCategory);
    }
    switch (sort) {
      case "prix-asc":
        list.sort((a, b) => a.priceEur - b.priceEur);
        break;
      case "prix-desc":
        list.sort((a, b) => b.priceEur - a.priceEur);
        break;
      case "nom":
        list.sort((a, b) => a.name.localeCompare(b.name, "fr"));
        break;
      case "nouveautes":
        list.sort((a, b) => Number(b.isNew) - Number(a.isNew));
        break;
    }
    return list;
  }, [products, activeCategory, sort]);

  const setCategory = (value: string) => {
    setSearchParams(value === "toutes" ? {} : { categorie: value });
  };

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />

      <main className="flex-1">
        {/* En-tête de page */}
        <section className="border-b border-border/70 bg-secondary/40">
          <div className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6">
            <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
              La collection
            </p>
            <h1 className="mt-2 font-display text-4xl font-semibold text-foreground sm:text-5xl">
              Toutes nos <span className="italic text-gold">pièces</span>
            </h1>
            <p className="mt-3 max-w-xl text-sm leading-relaxed text-muted-foreground">
              Une garde-robe féminine, sobre et durable. Chaque pièce est
              expédiée partout dans le monde, avec 30 jours pour changer d'avis.
            </p>
          </div>
        </section>

        {/* Filtres */}
        <section className="sticky top-[97px] z-30 border-b border-border/70 bg-background/95 backdrop-blur-md">
          <div className="mx-auto flex w-full max-w-7xl flex-wrap items-center gap-x-2 gap-y-3 px-4 py-3 sm:px-6">
            <div className="flex flex-1 flex-wrap items-center gap-x-1 gap-y-1">
              <button
                type="button"
                onClick={() => setCategory("toutes")}
                className={cn(
                  "px-3 py-1.5 text-[13px] uppercase tracking-[0.12em] transition-colors",
                  activeCategory === "toutes"
                    ? "text-foreground underline decoration-gold decoration-2 underline-offset-8"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                Toutes
              </button>
              {CATEGORY_ORDER.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setCategory(cat)}
                  className={cn(
                    "px-3 py-1.5 text-[13px] uppercase tracking-[0.12em] transition-colors",
                    activeCategory === cat
                      ? "text-foreground underline decoration-gold decoration-2 underline-offset-8"
                      : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  {CATEGORY_LABELS[cat]}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-3">
              <span className="hidden text-xs text-muted-foreground sm:inline">
                {products
                  ? `${filtered.length} pièce${filtered.length > 1 ? "s" : ""}`
                  : ""}
              </span>
              <Select value={sort} onValueChange={(v) => setSort(v as SortKey)}>
                <SelectTrigger className="h-8 w-[190px] rounded-none border-border/80 text-xs uppercase tracking-[0.1em]">
                  <SelectValue placeholder="Trier" />
                </SelectTrigger>
                <SelectContent>
                  {(Object.keys(SORT_LABELS) as SortKey[]).map((key) => (
                    <SelectItem key={key} value={key} className="text-sm">
                      {SORT_LABELS[key]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </section>

        {/* Grille catalogue */}
        <section className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6">
          {!products ? (
            <ProductGridSkeleton />
          ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center gap-4 py-20 text-center">
              <PackageSearch className="size-10 text-muted-foreground/50" />
              <p className="font-display text-2xl text-foreground">
                Aucune pièce dans cette catégorie pour le moment
              </p>
              <Button variant="outline" onClick={() => setCategory("toutes")}>
                Voir tout le catalogue
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-x-5 gap-y-10 md:grid-cols-3 xl:grid-cols-4">
              {filtered.map((product, i) => (
                <ProductCard
                  key={product._id}
                  product={product}
                  currency={currency}
                  priority={i < 4}
                />
              ))}
            </div>
          )}
        </section>

        {/* Rappel compte */}
        <section className="border-t border-border/70 bg-primary text-primary-foreground">
          <div className="mx-auto flex w-full max-w-7xl flex-col items-start justify-between gap-6 px-4 py-14 sm:px-6 md:flex-row md:items-center">
            <div>
              <h2 className="font-display text-3xl font-semibold">
                Créez votre compte en 30 secondes
              </h2>
              <p className="mt-2 max-w-lg text-sm leading-relaxed text-primary-foreground/80">
                Suivez vos commandes, enregistrez vos favoris et recevez en
                avant-première nos nouvelles collections, où que vous soyez.
              </p>
            </div>
            <Button
              size="lg"
              variant="secondary"
              className="shrink-0 gap-2 uppercase tracking-[0.12em]"
              asChild
            >
              <Link to="/auth?mode=signin">
                Sign in
                <MoveRight className="size-4" />
              </Link>
            </Button>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
