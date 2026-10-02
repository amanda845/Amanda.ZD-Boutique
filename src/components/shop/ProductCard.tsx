import {
  CATEGORY_LABELS,
  formatPrice,
  type CurrencyCode,
  type Product,
} from "@/lib/products";
import { cn } from "@/lib/utils";
import { useCart } from "@/hooks/use-cart";
import { Heart, ShoppingBag, Sparkles } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export function ProductCard({
  product,
  currency,
  priority = false,
}: {
  product: Product;
  currency: CurrencyCode;
  priority?: boolean;
}) {
  const [liked, setLiked] = useState(false);
  const [imgLoaded, setImgLoaded] = useState(false);
  const { addItem } = useCart();

  const handleAddToCart = () => {
    const defaultSize = product.sizes[0] || "Unique";
    const defaultColor = product.colors[0] || "Standard";
    addItem(product, defaultSize, defaultColor);
    toast.success(`${product.name} ajouté au panier`, {
      description: `Taille ${defaultSize} · ${defaultColor}`,
    });
  };

  return (
    <article className="group flex flex-col">
      <div className="relative overflow-hidden rounded-2xl bg-[#F0ECF6] border border-[#E8E2F2] transition-all duration-300 group-hover:border-[#B8A1FF]/50 group-hover:shadow-[0_10px_30px_rgba(184,161,255,0.18)]">
        {/* Image Produit */}
        <div className="aspect-[3/4] overflow-hidden">
          <img
            src={product.imageUrl}
            alt={product.name}
            loading={priority ? "eager" : "lazy"}
            onLoad={() => setImgLoaded(true)}
            className={cn(
              "size-full object-cover transition-all duration-700 ease-out group-hover:scale-[1.05]",
              imgLoaded ? "opacity-100" : "opacity-0",
            )}
          />
        </div>

        {/* Étiquettes Haut Gauche */}
        <div className="absolute left-3 top-3 flex flex-col items-start gap-1.5">
          {product.isNew && (
            <span className="inline-flex items-center gap-1 rounded-full bg-[#B8A1FF] px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-[#0B0B0E] shadow-sm">
              <Sparkles className="size-3" />
              Nouveau
            </span>
          )}
          <span className="rounded-full bg-white/90 px-3 py-1 text-[10px] font-medium uppercase tracking-wider text-neutral-800 backdrop-blur-md shadow-xs">
            {product.sizes.join(" · ")}
          </span>
        </div>

        {/* Bouton Favori Coeur */}
        <button
          type="button"
          aria-label="Ajouter aux favoris"
          onClick={() => {
            setLiked((v) => !v);
            if (!liked)
              toast(`${product.name} ajouté à vos favoris`, {
                description: "Article sauvegardé dans votre sélection.",
              });
          }}
          className="absolute right-3 top-3 flex size-9 items-center justify-center rounded-full bg-white/90 text-neutral-700 backdrop-blur-md transition-all hover:bg-white hover:text-[#7C3AED] hover:scale-110 shadow-xs"
        >
          <Heart
            className={cn(
              "size-4 transition-colors",
              liked && "fill-[#7C3AED] text-[#7C3AED]",
            )}
          />
        </button>

        {/* Bouton Ajout Panier au survol (Pillule Violette) */}
        <div className="absolute inset-x-3 bottom-3 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
          <button
            type="button"
            aria-label="Ajouter au panier"
            onClick={handleAddToCart}
            className="w-full flex items-center justify-center gap-2 rounded-xl bg-[#0B0B0E]/90 hover:bg-[#0B0B0E] text-[#B8A1FF] py-3 text-xs font-semibold uppercase tracking-wider shadow-lg backdrop-blur-md transition-all border border-[#B8A1FF]/30"
          >
            <ShoppingBag className="size-3.5 text-[#B8A1FF]" />
            Ajouter au panier
          </button>
        </div>
      </div>

      {/* Détails Produit */}
      <div className="flex flex-1 flex-col items-start gap-1 pt-3.5 px-1">
        <span className="text-[11px] font-medium uppercase tracking-[0.16em] text-[#7C3AED]">
          {CATEGORY_LABELS[product.category]}
        </span>
        <h3 className="font-serif text-lg font-semibold text-neutral-900 leading-snug group-hover:text-[#7C3AED] transition-colors">
          {product.name}
        </h3>
        <p className="text-sm font-semibold text-neutral-900 mt-0.5">
          {formatPrice(product.priceEur, currency)}
        </p>
      </div>
    </article>
  );
}
