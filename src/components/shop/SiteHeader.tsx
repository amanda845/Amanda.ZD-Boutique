import { useAuth } from "@/hooks/use-auth";
import { useCart } from "@/hooks/use-cart";
import { CurrencySelect, useCurrency } from "@/components/shop/currency";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import {
  Globe2,
  LayoutDashboard,
  LogIn,
  LogOut,
  Menu,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  User,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router";

const NAV_ITEMS = [
  { to: "/", label: "Accueil" },
  { to: "/boutique", label: "Boutique" },
  { to: "/mon-compte", label: "Mes commandes" },
];

/** Logo officiel Amanda.ZD avec le monogramme AMD officiel */
export function Wordmark({ className }: { className?: string }) {
  return (
    <Link
      to="/"
      className={cn("flex items-center gap-3 select-none group", className)}
      aria-label="Amanda.ZD — accueil"
    >
      <div className="relative size-11 sm:size-12 shrink-0 overflow-hidden rounded-xl border border-[#352F4A] bg-[#121118] shadow-md group-hover:border-[#B8A1FF] group-hover:shadow-[0_0_18px_rgba(184,161,255,0.35)] transition-all flex items-center justify-center">
        <img
          src="/images/amanda-logo.png"
          alt="Logo Amanda.ZD"
          className="size-full object-cover scale-110"
        />
      </div>
      <div className="flex flex-col">
        <span className="font-serif text-xl sm:text-2xl font-bold tracking-wider text-white leading-none">
          Amanda<span className="text-[#B8A1FF]">.ZD</span>
        </span>
        <span className="text-[9px] uppercase tracking-[0.25em] text-[#B8A1FF] font-semibold mt-1">
          Haute Confection
        </span>
      </div>
    </Link>
  );
}

export function SiteHeader() {
  const { isLoading, isAuthenticated, isAdmin, user, signOut } = useAuth();
  const { itemCount } = useCart();
  const { currency, setCurrency } = useCurrency();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleSignOut = async () => {
    try {
      localStorage.removeItem("client_id_session");
      await signOut();
      navigate("/");
    } catch (error) {
      console.error("Sign out error:", error);
    }
  };

  return (
    <header
      className={cn(
        "sticky top-0 z-50 border-b border-[#232030] bg-[#0B0B0E]/95 backdrop-blur-md transition-all",
        scrolled && "shadow-[0_4px_30px_rgba(0,0,0,0.6)] border-[#322C47]",
      )}
    >
      {/* ─── BANDEAU SUPÉRIEUR LILAS DOUX (Style STYLEO) ─── */}
      <div className="bg-[#DDD1FE] text-[#12111A] py-1.5 px-4 text-center text-[11px] font-semibold tracking-widest uppercase border-b border-[#C8B6FF]">
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between">
          <div className="hidden sm:flex items-center gap-2 text-[10px] tracking-wider text-[#2B2245]">
            <Globe2 className="size-3 text-[#7C3AED]" />
            <span>Livraison internationale offerte dès 150 €</span>
          </div>

          <div className="flex-1 sm:flex-initial text-center sm:text-left flex items-center justify-center gap-1.5 font-bold">
            <Sparkles className="size-3 text-[#7C3AED]" />
            <span>NOUVELLE COLLECTION AUTOMNE — LILAS & OBSIDIENNE</span>
          </div>

          <div className="flex items-center gap-3 text-[11px]">
            <CurrencySelect value={currency} onChange={setCurrency} />
          </div>
        </div>
      </div>

      {/* ─── BARRE DE NAVIGATION PRINCIPALE (Noir Profond & Accents Violets) ─── */}
      <div className="mx-auto flex h-16 sm:h-20 w-full max-w-7xl items-center justify-between gap-4 px-4 sm:px-6">
        <Wordmark />

        {/* Navigation Desktop */}
        <nav
          className="hidden items-center gap-9 md:flex"
          aria-label="Navigation principale"
        >
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === "/"}
              className={({ isActive }) =>
                cn(
                  "text-[12px] font-medium uppercase tracking-[0.2em] transition-all relative py-1",
                  isActive
                    ? "text-[#B8A1FF] font-semibold after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2px] after:bg-[#B8A1FF]"
                    : "text-neutral-300 hover:text-white hover:tracking-[0.22em]",
                )
              }
            >
              {item.label}
            </NavLink>
          ))}
          {isAdmin && (
            <NavLink
              to="/admin"
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-1.5 text-[12px] font-medium uppercase tracking-[0.16em] transition-colors",
                  isActive
                    ? "text-[#B8A1FF] font-semibold"
                    : "text-[#B8A1FF]/80 hover:text-[#B8A1FF]",
                )
              }
            >
              <ShieldCheck className="size-3.5" />
              Admin
            </NavLink>
          )}
        </nav>

        {/* Actions Droite (Panier & Bouton Espace Client / Connexion) */}
        <div className="flex items-center gap-3 sm:gap-4">
          {/* Panier */}
          <Link
            to="/panier"
            className="group relative flex size-10 items-center justify-center rounded-full border border-neutral-700 bg-neutral-900/80 text-white transition-all hover:border-[#B8A1FF] hover:bg-neutral-800"
            aria-label="Voir le panier"
          >
            <ShoppingBag className="size-4 transition-transform group-hover:scale-110 text-neutral-200 group-hover:text-[#B8A1FF]" />
            {itemCount > 0 && (
              <span className="absolute -right-1 -top-1 flex size-5 items-center justify-center rounded-full bg-[#B8A1FF] text-[10px] font-bold text-black shadow-md">
                {itemCount}
              </span>
            )}
          </Link>

          {/* Bouton Authentification (Pill Lilas Couture) */}
          {isLoading ? (
            <div className="size-9 animate-pulse rounded-full bg-neutral-800" />
          ) : isAuthenticated ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  type="button"
                  className="flex items-center gap-2 rounded-full border border-neutral-700 bg-neutral-900 px-4 py-2 text-xs font-medium text-white hover:border-[#B8A1FF] transition-all"
                >
                  <User className="size-3.5 text-[#B8A1FF]" />
                  <span className="max-w-[120px] truncate hidden sm:inline">
                    {user?.name || user?.email || "Compte"}
                  </span>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="w-56 rounded-xl border border-neutral-800 bg-[#121118] text-white shadow-xl"
              >
                <div className="px-3 py-2 border-b border-neutral-800">
                  <p className="text-[11px] font-bold uppercase tracking-wider text-[#B8A1FF]">
                    {isAdmin ? "Administrateur" : "Espace Client"}
                  </p>
                  <p className="text-xs text-neutral-300 truncate">
                    {user?.email}
                  </p>
                </div>
                <DropdownMenuItem
                  onClick={() => navigate("/mon-compte")}
                  className="cursor-pointer hover:bg-neutral-800/80 hover:text-[#B8A1FF] text-xs py-2.5"
                >
                  Mes commandes & profil
                </DropdownMenuItem>
                {isAdmin && (
                  <DropdownMenuItem
                    onClick={() => navigate("/admin")}
                    className="cursor-pointer hover:bg-neutral-800/80 hover:text-[#B8A1FF] text-xs py-2.5"
                  >
                    <LayoutDashboard className="mr-2 size-3.5" />
                    Panneau d'administration
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem
                  onClick={handleSignOut}
                  className="cursor-pointer text-red-400 hover:bg-red-500/10 text-xs py-2.5"
                >
                  <LogOut className="mr-2 size-3.5" />
                  Se déconnecter
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <button
              type="button"
              onClick={() => navigate("/auth")}
              className="rounded-full bg-[#B8A1FF] hover:bg-[#A78BFA] text-[#0B0B0E] px-5 py-2 sm:py-2.5 text-xs font-semibold tracking-wider uppercase transition-all shadow-md shadow-[#B8A1FF]/20 flex items-center gap-1.5"
            >
              <span>Connexion</span>
              <span className="text-[14px]">→</span>
            </button>
          )}

          {/* Bouton Menu Mobile */}
          <button
            type="button"
            className="flex size-10 items-center justify-center rounded-full border border-neutral-700 bg-neutral-900 text-white md:hidden hover:border-[#B8A1FF]"
            onClick={() => setOpen(!open)}
            aria-label="Ouvrir le menu"
          >
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </div>

      {/* ─── MENU MOBILE DÉROULANT (Noir & Accents Violets) ─── */}
      {open && (
        <div className="border-t border-neutral-800 bg-[#0B0B0E] px-6 py-6 md:hidden">
          <nav className="flex flex-col gap-4">
            {NAV_ITEMS.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === "/"}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  cn(
                    "text-sm uppercase tracking-widest py-2 transition-colors",
                    isActive ? "text-[#B8A1FF] font-bold" : "text-neutral-300 hover:text-white",
                  )
                }
              >
                {item.label}
              </NavLink>
            ))}
            {isAdmin && (
              <NavLink
                to="/admin"
                onClick={() => setOpen(false)}
                className="text-sm uppercase tracking-widest text-[#B8A1FF] py-2 flex items-center gap-2"
              >
                <ShieldCheck className="size-4" />
                Administration
              </NavLink>
            )}
            <div className="pt-4 border-t border-neutral-800 flex flex-col gap-3">
              <Button
                onClick={() => {
                  setOpen(false);
                  navigate("/auth");
                }}
                className="w-full rounded-full bg-[#B8A1FF] text-black font-semibold hover:bg-[#A78BFA]"
              >
                Accéder à mon compte
              </Button>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
