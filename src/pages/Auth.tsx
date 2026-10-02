import { useAuth } from "@/hooks/use-auth";
import { supabase } from "@/lib/supabase";
import { motion, AnimatePresence } from "framer-motion";
import {
  KeyRound,
  Loader2,
  Lock,
  Mail,
  ShieldCheck,
  Sparkles,
  User,
  UserCheck,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { toast } from "sonner";

interface AuthProps {
  redirectAfterAuth?: string;
}

export default function Auth({ redirectAfterAuth = "/mon-compte" }: AuthProps) {
  const { isAuthenticated, isAdmin, signIn, signUp } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // Onglet principal : 'client' | 'admin'
  const initialTab = searchParams.get("tab") === "admin" ? "admin" : "client";
  const [activeTab, setActiveTab] = useState<"client" | "admin">(initialTab);

  // Sous-mode pour l'Espace Client : 'signin' | 'signup'
  const initialMode = searchParams.get("mode") === "signup" ? "signup" : "signin";
  const [clientMode, setClientMode] = useState<"signin" | "signup">(initialMode);

  // États du formulaire Client
  const [clientName, setClientName] = useState("");
  const [clientEmail, setClientEmail] = useState("");
  const [clientPassword, setClientPassword] = useState("");
  const [quickClientId, setQuickClientId] = useState("123456");

  // États du formulaire Admin
  const [adminEmail, setAdminEmail] = useState("admin@amanda.zd");
  const [adminPassword, setAdminPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Redirection automatique si déjà connecté en admin
  useEffect(() => {
    if (isAuthenticated && isAdmin && activeTab === "admin") {
      navigate("/admin");
    }
  }, [isAuthenticated, isAdmin, activeTab, navigate]);

  // 1. Connexion Client (Email + Mot de passe)
  const handleClientSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setLoading(true);

    const email = clientEmail.trim().toLowerCase();
    const password = clientPassword.trim();

    if (!email || !password) {
      setErrorMsg("Veuillez saisir votre adresse e-mail et votre mot de passe.");
      setLoading(false);
      return;
    }

    try {
      const supabaseConfigured =
        import.meta.env.VITE_SUPABASE_URL &&
        import.meta.env.VITE_SUPABASE_ANON_KEY;

      if (supabaseConfigured) {
        try {
          const { error: sbError } = await supabase.auth.signInWithPassword({
            email,
            password,
          });
          if (!sbError) {
            toast.success("Bon retour parmi nous !", {
              description: "Connexion réussie à votre espace client.",
            });
            navigate(redirectAfterAuth || "/mon-compte");
            return;
          }
        } catch {
          // Fallback sur le système local
        }
      }

      await signIn(email, password);
      toast.success("Bon retour parmi nous !", {
        description: "Connexion réussie à votre espace client.",
      });
      navigate(redirectAfterAuth || "/mon-compte");
    } catch (err: unknown) {
      const message =
        err instanceof Error
          ? err.message
          : "Identifiants invalides. Vérifiez votre e-mail et mot de passe.";
      setErrorMsg(message);
    } finally {
      setLoading(false);
    }
  };

  // 2. Inscription Client (Création de compte)
  const handleClientSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setLoading(true);

    const name = clientName.trim();
    const email = clientEmail.trim().toLowerCase();
    const password = clientPassword.trim();

    if (!name || !email || !password) {
      setErrorMsg("Veuillez renseigner tous les champs obligatoires.");
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setErrorMsg("Le mot de passe doit contenir au moins 6 caractères.");
      setLoading(false);
      return;
    }

    try {
      const supabaseConfigured =
        import.meta.env.VITE_SUPABASE_URL &&
        import.meta.env.VITE_SUPABASE_ANON_KEY;

      if (supabaseConfigured) {
        try {
          const { error: sbError } = await supabase.auth.signUp({
            email,
            password,
            options: { data: { name } },
          });
          if (!sbError) {
            toast.success("Bienvenue chez Amanda.ZD !", {
              description: "Votre compte client a été créé avec succès.",
            });
            navigate(redirectAfterAuth || "/mon-compte");
            return;
          }
        } catch {
          // Fallback sur useAuth
        }
      }

      await signUp(email, password, name);
      toast.success("Bienvenue chez Amanda.ZD !", {
        description: `Votre compte pour ${name} a été créé avec succès.`,
      });
      navigate(redirectAfterAuth || "/mon-compte");
    } catch (err: unknown) {
      const message =
        err instanceof Error
          ? err.message
          : "Erreur lors de la création du compte.";
      setErrorMsg(message);
    } finally {
      setLoading(false);
    }
  };

  // 3. Accès rapide Client par Identifiant (Ex: 123456)
  const handleQuickClientAuth = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    const trimmedId = quickClientId.trim();
    if (!trimmedId) {
      setErrorMsg("Veuillez saisir un identifiant client valide.");
      return;
    }

    localStorage.setItem("client_id_session", trimmedId);
    toast.success("Espace client déverrouillé !", {
      description: `Identifiant client #${trimmedId} reconnu.`,
    });
    navigate(redirectAfterAuth || "/mon-compte");
  };

  // 4. Connexion Administrateur vers /admin
  const handleAdminAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);

    const email = adminEmail.trim().toLowerCase();
    const password = adminPassword.trim();

    if (!email || !password) {
      setErrorMsg("Veuillez renseigner votre e-mail et votre mot de passe administrateur.");
      setLoading(false);
      return;
    }

    try {
      const supabaseConfigured =
        import.meta.env.VITE_SUPABASE_URL &&
        import.meta.env.VITE_SUPABASE_ANON_KEY;

      if (supabaseConfigured) {
        try {
          const { error: sbError } = await supabase.auth.signInWithPassword({
            email,
            password,
          });
          if (!sbError) {
            toast.success("Connexion administrateur réussie", {
              description: "Accès au tableau de bord de gestion.",
            });
            navigate("/admin");
            return;
          }
        } catch {
          // Fallback local
        }
      }

      const user = await signIn(email, password);

      if (user.role === "admin") {
        toast.success("Connexion administrateur réussie", {
          description: "Bienvenue sur le tableau de bord Amanda.ZD.",
        });
        navigate("/admin");
      } else {
        toast.info("Compte client détecté", {
          description: "Redirection vers votre espace client.",
        });
        navigate("/mon-compte");
      }
    } catch {
      setErrorMsg(
        "Accès refusé. Identifiants administrateur incorrects (défaut : admin@amanda.zd / admin123)."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0B0B0E] text-white flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Halo violet d'ambiance en arrière-plan */}
      <div className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 size-[600px] rounded-full bg-[#B8A1FF]/10 blur-[150px]" />

      {/* Bouton Retour */}
      <button
        type="button"
        onClick={() => navigate("/")}
        className="mb-6 text-xs tracking-widest text-neutral-400 hover:text-[#B8A1FF] uppercase transition-colors flex items-center gap-1.5 relative z-10"
      >
        <span>←</span> RETOUR À LA BOUTIQUE
      </button>

      {/* Logo Amanda.ZD avec Monogramme Officiel */}
      <div className="text-center mb-7 relative z-10 flex flex-col items-center">
        <div className="size-16 sm:size-20 mb-3.5 overflow-hidden rounded-2xl border border-[#352F4A] bg-[#121118] shadow-xl flex items-center justify-center glow-violet-sm">
          <img
            src="/images/amanda-logo.png"
            alt="Logo Amanda.ZD"
            className="size-full object-cover scale-110"
          />
        </div>
        <h1 className="text-3xl sm:text-4xl font-serif tracking-wider text-white">
          Amanda<span className="text-[#B8A1FF]">.ZD</span>
        </h1>
        <p className="text-xs text-neutral-400 tracking-[0.25em] uppercase mt-1.5 font-light">
          L'ÉLÉGANCE SIGNÉE AMANDA.ZD
        </p>
      </div>

      {/* Carte principale Noir & Violet Couture */}
      <div className="bg-[#121118]/90 border border-[#2D273D] p-7 sm:p-9 rounded-3xl shadow-2xl backdrop-blur-xl w-full max-w-md relative z-10 glow-violet-sm">
        {/* Barre des 2 Espaces Principaux : Client & Admin */}
        <div className="grid grid-cols-2 gap-1.5 bg-[#1C1A27] p-1.5 rounded-2xl text-xs font-medium mb-6 border border-[#2B273C]">
          <button
            type="button"
            onClick={() => {
              setActiveTab("client");
              setErrorMsg(null);
            }}
            className={`py-2.5 px-3 rounded-xl transition-all text-center flex items-center justify-center gap-2 ${
              activeTab === "client"
                ? "bg-[#B8A1FF] text-[#0B0B0E] font-bold shadow-md"
                : "text-neutral-400 hover:text-white"
            }`}
          >
            <User className="size-4" />
            <span>Espace Client</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveTab("admin");
              setErrorMsg(null);
            }}
            className={`py-2.5 px-3 rounded-xl transition-all text-center flex items-center justify-center gap-2 ${
              activeTab === "admin"
                ? "bg-white text-[#0B0B0E] font-bold shadow-md"
                : "text-neutral-400 hover:text-white"
            }`}
          >
            <ShieldCheck className="size-4" />
            <span>Espace Admin</span>
          </button>
        </div>

        {/* Message d'erreur éventuel */}
        {errorMsg && (
          <div className="mb-5 p-3.5 bg-red-950/40 text-red-300 text-xs rounded-xl border border-red-800/50 leading-relaxed">
            {errorMsg}
          </div>
        )}

        <AnimatePresence mode="wait">
          {/* ══════════════════════════════════════════════════════════════
              ESPACE CLIENT (SE CONNECTER & S'INSCRIRE)
          ══════════════════════════════════════════════════════════════ */}
          {activeTab === "client" && (
            <motion.div
              key="space-client"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.2 }}
            >
              {/* Sous-onglets Client : Connexion vs Inscription */}
              <div className="flex border-b border-neutral-800 mb-6">
                <button
                  type="button"
                  onClick={() => {
                    setClientMode("signin");
                    setErrorMsg(null);
                  }}
                  className={`flex-1 pb-2.5 text-xs font-semibold tracking-wider uppercase transition-colors relative ${
                    clientMode === "signin"
                      ? "text-white border-b-2 border-[#B8A1FF]"
                      : "text-neutral-500 hover:text-neutral-300"
                  }`}
                >
                  SE CONNECTER
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setClientMode("signup");
                    setErrorMsg(null);
                  }}
                  className={`flex-1 pb-2.5 text-xs font-semibold tracking-wider uppercase transition-colors relative ${
                    clientMode === "signup"
                      ? "text-[#B8A1FF] border-b-2 border-[#B8A1FF]"
                      : "text-neutral-500 hover:text-neutral-300"
                  }`}
                >
                  S'INSCRIRE
                </button>
              </div>

              {/* SOUS-MODE 1 : SE CONNECTER */}
              {clientMode === "signin" && (
                <div className="space-y-5">
                  <form onSubmit={handleClientSignIn} className="space-y-4">
                    <div>
                      <label className="block text-[10px] font-bold text-neutral-300 uppercase tracking-wider mb-1.5">
                        Adresse E-mail
                      </label>
                      <div className="relative">
                        <input
                          type="email"
                          required
                          placeholder="votre.email@exemple.com"
                          value={clientEmail}
                          onChange={(e) => setClientEmail(e.target.value)}
                          className="w-full px-4 py-2.5 pl-10 border border-[#2D273D] bg-[#1A1824] rounded-xl text-sm text-white placeholder:text-neutral-500 focus:outline-none focus:border-[#B8A1FF]"
                        />
                        <Mail className="size-4 text-neutral-500 absolute left-3 top-1/2 -translate-y-1/2" />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-neutral-300 uppercase tracking-wider mb-1.5">
                        Mot de passe
                      </label>
                      <div className="relative">
                        <input
                          type="password"
                          required
                          placeholder="••••••••"
                          value={clientPassword}
                          onChange={(e) => setClientPassword(e.target.value)}
                          className="w-full px-4 py-2.5 pl-10 border border-[#2D273D] bg-[#1A1824] rounded-xl text-sm text-white placeholder:text-neutral-500 focus:outline-none focus:border-[#B8A1FF]"
                        />
                        <Lock className="size-4 text-neutral-500 absolute left-3 top-1/2 -translate-y-1/2" />
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full py-3.5 rounded-full bg-[#B8A1FF] text-[#0B0B0E] text-xs font-bold tracking-wider uppercase hover:bg-[#A78BFA] transition-all shadow-lg shadow-[#B8A1FF]/20 flex items-center justify-center gap-2"
                    >
                      {loading ? (
                        <>
                          <Loader2 className="size-4 animate-spin" />
                          Connexion en cours...
                        </>
                      ) : (
                        "SE CONNECTER →"
                      )}
                    </button>
                  </form>

                  {/* Accès rapide par Identifiant Client (123456) */}
                  <div className="pt-4 border-t border-neutral-800">
                    <p className="text-[11px] text-neutral-400 text-center mb-2.5 font-medium flex items-center justify-center gap-1.5">
                      <Sparkles className="size-3 text-[#B8A1FF]" />
                      Accès direct par identifiant client :
                    </p>
                    <form
                      onSubmit={handleQuickClientAuth}
                      className="flex gap-2"
                    >
                      <div className="relative flex-1">
                        <input
                          type="text"
                          required
                          placeholder="Ex: 123456"
                          value={quickClientId}
                          onChange={(e) => setQuickClientId(e.target.value)}
                          className="w-full px-3 py-2 pl-8 border border-[#2D273D] bg-[#1A1824] rounded-xl text-xs font-mono text-white placeholder:text-neutral-500 focus:outline-none focus:border-[#B8A1FF]"
                        />
                        <KeyRound className="size-3.5 text-neutral-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                      </div>
                      <button
                        type="submit"
                        className="px-4 py-2 rounded-xl bg-white text-black text-[11px] font-bold tracking-wider uppercase hover:bg-neutral-200 transition-colors whitespace-nowrap"
                      >
                        VOIR COMMANDES →
                      </button>
                    </form>
                  </div>

                  <p className="text-center text-xs text-neutral-400 pt-1">
                    Pas encore de compte ?{" "}
                    <button
                      type="button"
                      onClick={() => setClientMode("signup")}
                      className="font-semibold text-[#B8A1FF] hover:underline"
                    >
                      Créer un compte
                    </button>
                  </p>
                </div>
              )}

              {/* SOUS-MODE 2 : S'INSCRIRE */}
              {clientMode === "signup" && (
                <form onSubmit={handleClientSignUp} className="space-y-4">
                  <div>
                    <label className="block text-[10px] font-bold text-neutral-300 uppercase tracking-wider mb-1.5">
                      Nom complet
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        required
                        placeholder="Ex: Amanda Laurent"
                        value={clientName}
                        onChange={(e) => setClientName(e.target.value)}
                        className="w-full px-4 py-2.5 pl-10 border border-[#2D273D] bg-[#1A1824] rounded-xl text-sm text-white placeholder:text-neutral-500 focus:outline-none focus:border-[#B8A1FF]"
                      />
                      <UserCheck className="size-4 text-neutral-500 absolute left-3 top-1/2 -translate-y-1/2" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-neutral-300 uppercase tracking-wider mb-1.5">
                      Adresse E-mail
                    </label>
                    <div className="relative">
                      <input
                        type="email"
                        required
                        placeholder="votre.email@exemple.com"
                        value={clientEmail}
                        onChange={(e) => setClientEmail(e.target.value)}
                        className="w-full px-4 py-2.5 pl-10 border border-[#2D273D] bg-[#1A1824] rounded-xl text-sm text-white placeholder:text-neutral-500 focus:outline-none focus:border-[#B8A1FF]"
                      />
                      <Mail className="size-4 text-neutral-500 absolute left-3 top-1/2 -translate-y-1/2" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-neutral-300 uppercase tracking-wider mb-1.5">
                      Mot de passe
                    </label>
                    <div className="relative">
                      <input
                        type="password"
                        required
                        minLength={6}
                        placeholder="Minimum 6 caractères"
                        value={clientPassword}
                        onChange={(e) => setClientPassword(e.target.value)}
                        className="w-full px-4 py-2.5 pl-10 border border-[#2D273D] bg-[#1A1824] rounded-xl text-sm text-white placeholder:text-neutral-500 focus:outline-none focus:border-[#B8A1FF]"
                      />
                      <Lock className="size-4 text-neutral-500 absolute left-3 top-1/2 -translate-y-1/2" />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3.5 rounded-full bg-[#B8A1FF] text-[#0B0B0E] text-xs font-bold tracking-wider uppercase hover:bg-[#A78BFA] transition-all shadow-lg shadow-[#B8A1FF]/20 flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="size-4 animate-spin" />
                        Création du compte...
                      </>
                    ) : (
                      "CRÉER MON COMPTE →"
                    )}
                  </button>

                  <p className="text-center text-xs text-neutral-400 pt-2">
                    Vous possédez déjà un compte ?{" "}
                    <button
                      type="button"
                      onClick={() => setClientMode("signin")}
                      className="font-semibold text-[#B8A1FF] hover:underline"
                    >
                      Se connecter
                    </button>
                  </p>
                </form>
              )}
            </motion.div>
          )}

          {/* ══════════════════════════════════════════════════════════════
              ESPACE ADMINISTRATEUR
          ══════════════════════════════════════════════════════════════ */}
          {activeTab === "admin" && (
            <motion.div
              key="space-admin"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.2 }}
            >
              <div className="text-center mb-6">
                <h2 className="font-serif text-xl font-semibold text-white mb-1">
                  Espace Administration
                </h2>
                <p className="text-xs text-neutral-400">
                  Accès réservé aux administrateurs de la boutique.
                </p>
              </div>

              <form onSubmit={handleAdminAuth} className="space-y-4">
                <div>
                  <label className="block text-[10px] font-bold text-neutral-300 uppercase tracking-wider mb-1.5">
                    Adresse E-mail Admin
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      required
                      placeholder="admin@amanda.zd"
                      value={adminEmail}
                      onChange={(e) => setAdminEmail(e.target.value)}
                      className="w-full px-4 py-2.5 pl-10 border border-[#2D273D] bg-[#1A1824] rounded-xl text-sm text-white placeholder:text-neutral-500 focus:outline-none focus:border-[#B8A1FF]"
                    />
                    <Mail className="size-4 text-neutral-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-[10px] font-bold text-neutral-300 uppercase tracking-wider">
                      Mot de passe Admin
                    </label>
                    <span className="text-[10px] text-neutral-500 font-mono">
                      défaut: admin123
                    </span>
                  </div>
                  <div className="relative">
                    <input
                      type="password"
                      required
                      placeholder="••••••••"
                      value={adminPassword}
                      onChange={(e) => setAdminPassword(e.target.value)}
                      className="w-full px-4 py-2.5 pl-10 border border-[#2D273D] bg-[#1A1824] rounded-xl text-sm text-white placeholder:text-neutral-500 focus:outline-none focus:border-[#B8A1FF]"
                    />
                    <Lock className="size-4 text-neutral-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 rounded-full bg-white text-black text-xs font-bold tracking-wider uppercase hover:bg-neutral-200 transition-all shadow-lg flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <Loader2 className="size-4 animate-spin" />
                      Vérification...
                    </>
                  ) : (
                    "CONNEXION ADMIN →"
                  )}
                </button>
              </form>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Pied de carte sécurisé */}
        <div className="mt-7 pt-4 border-t border-neutral-800 text-center text-[11px] text-neutral-500 flex items-center justify-center gap-1.5">
          <ShieldCheck className="size-3.5 text-[#B8A1FF]" />
          <span>Espace sécurisé & données chiffrées — Boutique Amanda.ZD</span>
        </div>
      </div>
    </div>
  );
}
