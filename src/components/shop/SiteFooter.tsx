import { Wordmark } from "@/components/shop/SiteHeader";
import { ArrowRight, Globe2, ShieldCheck, Sparkles } from "lucide-react";
import { Link } from "react-router";
import { useState } from "react";
import { toast } from "sonner";

export function SiteFooter() {
  const [email, setEmail] = useState("");

  const handleNewsletter = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    toast.success("Bienvenue dans le cercle Amanda.ZD", {
      description: "Vous recevrez nos invitations privées et nouvelles collections en avant-première.",
    });
    setEmail("");
  };

  return (
    <footer className="border-t border-[#232030] bg-[#0B0B0E] text-white">
      {/* ─── SECTION NEWSLETTER HAUTE COUTURE ─── */}
      <div className="border-b border-[#1E1B29] py-14">
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
          <div>
            <span className="inline-flex items-center gap-1.5 text-xs uppercase tracking-[0.2em] text-[#B8A1FF] font-semibold mb-2">
              <Sparkles className="size-3 text-[#B8A1FF]" />
              Le Cercle Privilège
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl text-white">
              Recevez nos avant-premières exclusives
            </h2>
            <p className="mt-2 text-sm text-neutral-400 max-w-md">
              Invitations privées, lancements de collections et inspirations mode directement dans votre boîte mail.
            </p>
          </div>

          <form onSubmit={handleNewsletter} className="flex w-full max-w-md gap-2">
            <input
              type="email"
              required
              placeholder="Votre adresse e-mail"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1 rounded-full border border-neutral-700 bg-neutral-900/90 px-5 py-3 text-xs text-white placeholder:text-neutral-500 focus:border-[#B8A1FF] focus:outline-none"
            />
            <button
              type="submit"
              className="rounded-full bg-[#B8A1FF] hover:bg-[#A78BFA] text-[#0B0B0E] px-6 py-3 text-xs font-semibold uppercase tracking-wider transition-all flex items-center gap-1.5 shadow-md shadow-[#B8A1FF]/20 whitespace-nowrap"
            >
              <span>S'inscrire</span>
              <ArrowRight className="size-3.5" />
            </button>
          </form>
        </div>
      </div>

      {/* ─── NAVIGATION DU FOOTER ─── */}
      <div className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6">
        <div className="grid gap-10 md:grid-cols-4">
          <div className="md:col-span-2">
            <Wordmark />
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-neutral-400">
              Maison de confection féminine raffinée alliant audace contemporaine et sobriété luxueuse. L'élégance signée Amanda.ZD.
            </p>
            <p className="mt-5 flex items-center gap-2 text-xs uppercase tracking-[0.14em] text-[#B8A1FF]">
              <Globe2 className="size-3.5 text-[#B8A1FF]" />
              Paris · Londres · Genève · Dubaï · New York
            </p>
          </div>

          <nav aria-label="Collections">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#B8A1FF]">
              Collections
            </p>
            <ul className="mt-4 space-y-3 text-sm text-neutral-400">
              <li>
                <Link to="/boutique" className="transition-colors hover:text-white">
                  Toutes les pièces
                </Link>
              </li>
              <li>
                <Link to="/boutique?categorie=hauts" className="transition-colors hover:text-white">
                  Tailleurs & Blazers
                </Link>
              </li>
              <li>
                <Link to="/boutique?categorie=robes" className="transition-colors hover:text-white">
                  Robes de soirée
                </Link>
              </li>
              <li>
                <Link to="/boutique?categorie=manteaux" className="transition-colors hover:text-white">
                  Manteaux & Cachemire
                </Link>
              </li>
              <li>
                <Link to="/boutique?categorie=accessoires" className="transition-colors hover:text-white">
                  Maroquinerie fine
                </Link>
              </li>
            </ul>
          </nav>

          <nav aria-label="Espace Client & Service">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#B8A1FF]">
              Service Client
            </p>
            <ul className="mt-4 space-y-3 text-sm text-neutral-400">
              <li>
                <Link to="/auth" className="transition-colors hover:text-white">
                  Connexion / S'inscrire
                </Link>
              </li>
              <li>
                <Link to="/mon-compte" className="transition-colors hover:text-white">
                  Suivi de commande
                </Link>
              </li>
              <li>
                <Link to="/auth?tab=admin" className="transition-colors hover:text-[#B8A1FF]">
                  Espace Administration
                </Link>
              </li>
              <li className="pt-2 text-xs text-neutral-500 flex items-center gap-1.5">
                <ShieldCheck className="size-3.5 text-[#B8A1FF]" />
                Paiement sécurisé et retours sous 30 jours
              </li>
            </ul>
          </nav>
        </div>

        <div className="mt-14 flex flex-col items-start justify-between gap-4 border-t border-neutral-800/80 pt-8 text-xs text-neutral-500 sm:flex-row sm:items-center">
          <p>© {new Date().getFullYear()} Amanda.ZD. Tous droits réservés.</p>
          <p className="uppercase tracking-[0.14em] text-neutral-400">
            L'Élégance Signée Amanda.ZD · Haute Confection
          </p>
        </div>
      </div>
    </footer>
  );
}
