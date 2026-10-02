import { ProductCard } from "@/components/shop/ProductCard";
import { SiteFooter } from "@/components/shop/SiteFooter";
import { SiteHeader } from "@/components/shop/SiteHeader";
import { useCurrency } from "@/components/shop/currency";
import { Button } from "@/components/ui/button";
import { CATEGORY_LABELS, CATEGORY_ORDER, DEFAULT_PRODUCTS } from "@/lib/products";
import { useAuth } from "@/hooks/use-auth";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Headphones,
  Package,
  RotateCcw,
  ShieldCheck,
  Sparkles,
  Truck,
} from "lucide-react";
import { Link, useNavigate } from "react-router";

const MARQUEE_ITEMS = [
  "Nouvelle collection Lilas & Obsidienne",
  "Livraison internationale offerte dès 150 €",
  "Retours simples sous 30 jours",
  "Haute confection signée Amanda.ZD",
  "Tailleurs & Robes de prestige",
];

const SELECTIONS = [
  {
    tag: "Tailleur Moderne",
    title: "Le Tailleur Lilas Couture",
    text: "L'élégance architecturée d'une veste structurée sur mesure.",
    image:
      "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=900&q=80",
    filter: "hauts" as const,
  },
  {
    tag: "Grands Soirs",
    title: "Le Satin Noir Profond",
    text: "Drapés fluides et coupes sensuelles pour des soirées inoubliables.",
    image:
      "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?auto=format&fit=crop&w=900&q=80",
    filter: "robes" as const,
  },
  {
    tag: "Essentiels Saison",
    title: "Manteaux en Laine & Cachemire",
    text: "Des volumes maîtrisés pensés pour traverser le temps avec grâce.",
    image:
      "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=900&q=80",
    filter: "manteaux" as const,
  },
];

const REASSURANCE = [
  {
    icon: Truck,
    title: "Livraison Offerte",
    text: "Expédition internationale gratuite dès 150 € d'achat.",
  },
  {
    icon: RotateCcw,
    title: "Retours 30 Jours",
    text: "Essayez chez vous, retours simples et sans aucun frais.",
  },
  {
    icon: ShieldCheck,
    title: "Paiement 100% Sécurisé",
    text: "Transactions bancaires entièrement chiffrées.",
  },
  {
    icon: Headphones,
    title: "Service Client Dédié",
    text: "Une écoute et des conseils personnalisés 7j/7.",
  },
];

/* ─── 1. HERO SECTION HAUTE COUTURE (Noir & Violet) ─── */
function Hero() {
  const navigate = useNavigate();

  return (
    <section className="relative overflow-hidden bg-[#0B0B0E] text-white pt-10 pb-20 lg:pt-16 lg:pb-28">
      {/* Halo lumineux violet en arrière-plan (Ambiance Lavender Future) */}
      <div className="pointer-events-none absolute right-0 top-1/4 -z-0 size-[550px] -translate-y-1/2 translate-x-1/3 rounded-full bg-[#B8A1FF]/15 blur-[140px]" />
      <div className="pointer-events-none absolute left-0 bottom-0 -z-0 size-[400px] -translate-x-1/3 rounded-full bg-[#7C3AED]/10 blur-[120px]" />

      <div className="relative z-10 mx-auto grid w-full max-w-7xl items-center gap-12 px-4 sm:px-6 lg:grid-cols-2 lg:gap-14">
        {/* Colonne Gauche : Titre & Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="order-2 lg:order-1"
        >
          {/* Badge Signature */}
          <div className="inline-flex items-center gap-2 rounded-full border border-[#B8A1FF]/30 bg-[#191624] px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.2em] text-[#B8A1FF] shadow-sm">
            <Sparkles className="size-3 text-[#B8A1FF]" />
            Collection Couture 2026
          </div>

          {/* Grand Titre Serif Style "Elevate Every Moment" */}
          <h1 className="mt-6 font-serif text-5xl sm:text-6xl lg:text-7xl font-semibold leading-[1.04] text-white">
            Sublimez
            <br />
            Chaque Instant.
          </h1>

          <p className="mt-5 max-w-lg text-base sm:text-lg leading-relaxed text-neutral-300 font-light">
            Allure contemporaine. Confiance intemporelle. Une collection
            exclusive où le noir profond rencontre la douceur lumineuse du lilas.
          </p>

          {/* Boutons d'Action (Pill Violet) */}
          <div className="mt-9 flex flex-wrap items-center gap-4">
            <button
              type="button"
              onClick={() => navigate("/boutique")}
              className="rounded-full bg-[#B8A1FF] hover:bg-[#A78BFA] text-[#0B0B0E] px-8 py-4 text-xs font-bold tracking-[0.16em] uppercase transition-all shadow-lg shadow-[#B8A1FF]/25 flex items-center gap-2 group hover:scale-[1.02]"
            >
              <span>Découvrir la collection</span>
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
            </button>

            <button
              type="button"
              onClick={() => navigate("/auth")}
              className="rounded-full border border-neutral-700 hover:border-[#B8A1FF] text-white hover:text-[#B8A1FF] px-7 py-4 text-xs font-semibold tracking-[0.16em] uppercase transition-all bg-neutral-900/60 backdrop-blur-sm"
            >
              Espace Client
            </button>
          </div>
        </motion.div>

        {/* Colonne Droite : Arche Stylisée & Modèle en Lilas Couture (Style STYLEO) */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.15 }}
          className="relative order-1 lg:order-2 flex justify-center"
        >
          {/* L'arche violette caractéristique avec la photo réelle du showroom Amanda */}
          <div className="relative w-full max-w-md sm:max-w-lg">
            <div className="aspect-[9/13] sm:aspect-[4/5] overflow-hidden rounded-t-[140px] rounded-b-3xl border border-[#352F4A] bg-[#161421] shadow-2xl relative group">
              <img
                src="/images/amanda-showroom.png"
                alt="Showroom Boutique Amanda.ZD — Collection Violette & Crème"
                className="size-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0B0B0E]/70 via-transparent to-transparent" />
            </div>

            {/* Badge flottant en verre dépoli (Glassmorphism) */}
            <div className="absolute -bottom-5 left-4 sm:-left-4 rounded-2xl border border-white/20 bg-[#161422]/95 p-4 sm:p-5 shadow-2xl backdrop-blur-md">
              <div className="flex items-center gap-3">
                <div className="flex size-11 items-center justify-center rounded-xl bg-[#B8A1FF] text-black">
                  <Sparkles className="size-5" />
                </div>
                <div>
                  <p className="font-serif text-xl sm:text-2xl font-bold text-white">
                    Showroom Amanda
                  </p>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#B8A1FF]">
                    Collection Violet & Crème
                  </p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

/* ─── 2. BANDEAU DE RÉASSURANCE FLOTTANT (Style STYLEO) ─── */
function ReassuranceBar() {
  return (
    <div className="relative z-20 mx-auto -mt-8 sm:-mt-10 w-full max-w-7xl px-4 sm:px-6">
      <div className="rounded-2xl border border-[#C8B6FF] bg-[#DDD1FE] p-5 sm:p-6 shadow-xl text-[#12111A]">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-4">
          {REASSURANCE.map((item, i) => (
            <div key={i} className="flex items-center gap-3.5">
              <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-[#12111A] text-[#B8A1FF]">
                <item.icon className="size-5" />
              </div>
              <div>
                <p className="text-xs sm:text-sm font-bold uppercase tracking-wider text-[#12111A]">
                  {item.title}
                </p>
                <p className="text-[11px] text-[#332A4D] font-medium leading-tight mt-0.5">
                  {item.text}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─── 3. BANDEAU MARQUEE DÉFILANT ─── */
function Marquee() {
  const items = [...MARQUEE_ITEMS, ...MARQUEE_ITEMS];
  return (
    <div className="overflow-hidden border-y border-[#262035] bg-[#0E0D13] py-4 mt-16 sm:mt-20">
      <div className="animate-marquee flex w-max items-center gap-12 whitespace-nowrap">
        {items.map((item, i) => (
          <span
            key={i}
            className="flex items-center gap-12 text-[12px] font-semibold uppercase tracking-[0.24em] text-neutral-300"
          >
            {item}
            <span className="text-[#B8A1FF] text-base">✦</span>
          </span>
        ))}
      </div>
    </div>
  );
}

/* ─── 4. SÉLECTION ÉDITORIALE (Featured Collection) ─── */
function FeaturedCollection() {
  return (
    <section className="mx-auto w-full max-w-7xl px-4 py-20 sm:px-6">
      <div className="flex flex-wrap items-end justify-between gap-4 mb-10">
        <div>
          <span className="text-xs font-bold uppercase tracking-[0.22em] text-[#7C3AED]">
            Inspiration
          </span>
          <h2 className="mt-2 font-serif text-3xl sm:text-5xl font-semibold text-neutral-900">
            Featured <span className="italic text-[#7C3AED]">Collection</span>
          </h2>
        </div>
        <Link
          to="/boutique"
          className="group flex items-center gap-2 rounded-full border border-neutral-300 bg-white px-5 py-2.5 text-xs font-semibold uppercase tracking-wider text-neutral-800 transition-all hover:border-[#7C3AED] hover:text-[#7C3AED]"
        >
          <span>Voir tout le catalogue</span>
          <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-1" />
        </Link>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {SELECTIONS.map((s, i) => (
          <motion.div
            key={s.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
          >
            <Link
              to={`/boutique?categorie=${s.filter}`}
              className="group relative block overflow-hidden rounded-3xl bg-[#F0ECF6] border border-[#E8E2F2] transition-all duration-300 hover:shadow-xl"
            >
              <div className="aspect-[4/5] overflow-hidden">
                <img
                  src={s.image}
                  alt={s.title}
                  loading="lazy"
                  className="size-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                />
              </div>

              {/* Tag en verre (Glassmorphism) en haut à gauche */}
              <div className="absolute left-4 top-4 rounded-full border border-white/40 bg-white/80 px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-wider text-black backdrop-blur-md shadow-xs">
                {s.tag}
              </div>

              {/* Overlay Texte en bas */}
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent p-6 pt-16">
                <h3 className="font-serif text-2xl font-bold text-white">
                  {s.title}
                </h3>
                <p className="mt-1 text-xs text-neutral-200 font-light">
                  {s.text}
                </p>
                <div className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold text-[#B8A1FF] group-hover:translate-x-1 transition-transform">
                  <span>Explorer</span>
                  <ArrowRight className="size-3.5" />
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

/* ─── 5. NOUVELLES ARRIVÉES (New Arrivals) ─── */
function NewArrivals() {
  const { currency } = useCurrency();
  const products = DEFAULT_PRODUCTS;
  const newest = products ? products.slice(0, 4) : [];

  return (
    <section className="border-t border-[#E8E2F2] bg-[#F7F4FB] py-20">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6">
        <div className="flex flex-wrap items-end justify-between gap-4 mb-10">
          <div>
            <span className="text-xs font-bold uppercase tracking-[0.22em] text-[#7C3AED]">
              Sélection Récente
            </span>
            <h2 className="mt-2 font-serif text-3xl sm:text-5xl font-semibold text-neutral-900">
              New <span className="italic text-[#7C3AED]">Arrivals</span>
            </h2>
          </div>
          <Link
            to="/boutique"
            className="group flex items-center gap-2 rounded-full border border-neutral-300 bg-white px-5 py-2.5 text-xs font-semibold uppercase tracking-wider text-neutral-800 transition-all hover:border-[#7C3AED] hover:text-[#7C3AED]"
          >
            <span>Toute la boutique</span>
            <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        <div className="grid grid-cols-2 gap-x-5 gap-y-10 md:grid-cols-4">
          {newest.map((product, i) => (
            <ProductCard
              key={product.id || i}
              product={product}
              currency={currency}
              priority={i < 2}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── 6. BANNIÈRE SIGNATURE (Timeless Looks. Endless Confidence.) ─── */
function SignatureBanner() {
  const navigate = useNavigate();

  return (
    <section className="relative overflow-hidden bg-[#0B0B0E] py-20 sm:py-24 text-white">
      <div className="pointer-events-none absolute left-1/3 top-0 -z-0 size-[450px] rounded-full bg-[#B8A1FF]/10 blur-[140px]" />

      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 grid lg:grid-cols-2 items-center gap-12">
        <div>
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.22em] text-[#B8A1FF] mb-3">
            <Sparkles className="size-3 text-[#B8A1FF]" />
            L'Allure Amanda.ZD
          </span>
          <h2 className="font-serif text-4xl sm:text-6xl font-semibold leading-[1.08] text-white">
            Allure Éternelle.
            <br />
            <span className="italic text-[#B8A1FF]">Confiance Absolue.</span>
          </h2>
          <p className="mt-6 max-w-md text-sm sm:text-base leading-relaxed text-neutral-300 font-light">
            Découvrez les silhouettes qui révèlent votre personnalité avec
            une assurance naturelle. Du travail aux soirées de prestige.
          </p>
          <button
            type="button"
            onClick={() => navigate("/boutique")}
            className="mt-8 rounded-full bg-[#B8A1FF] hover:bg-[#A78BFA] text-[#0B0B0E] px-8 py-3.5 text-xs font-bold tracking-[0.16em] uppercase transition-all shadow-lg shadow-[#B8A1FF]/20 flex items-center gap-2 group"
          >
            <span>Explorer la collection</span>
            <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
          </button>
        </div>

        <div className="relative">
          <div className="aspect-[16/10] overflow-hidden rounded-3xl border border-[#322A48] bg-[#161421] shadow-2xl">
            <img
              src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1200&q=80"
              alt="Haute couture Amanda.ZD"
              className="size-full object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

export default function Landing() {
  return (
    <div className="flex min-h-screen flex-col bg-[#FAF8F6]">
      <SiteHeader />
      <main className="flex-1">
        <Hero />
        <ReassuranceBar />
        <Marquee />
        <FeaturedCollection />
        <NewArrivals />
        <SignatureBanner />
      </main>
      <SiteFooter />
    </div>
  );
}
