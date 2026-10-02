import { Toaster } from "@/components/ui/sonner";
import { RequireAuth } from "@/components/RequireAuth";
import { CurrencyProvider } from "@/components/shop/currency";
import { AuthProvider } from "@/hooks/use-auth";
import { CartProvider } from "@/hooks/use-cart";
import React, { StrictMode, lazy, Suspense } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router";
import "./index.css";

// Lazy load des pages de la boutique Amanda.ZD
const Landing = lazy(() => import("./pages/Landing.tsx"));
const Boutique = lazy(() => import("./pages/Boutique.tsx"));
const Panier = lazy(() => import("./pages/Panier.tsx"));
const AuthPage = lazy(() => import("./pages/Auth.tsx"));
const MonCompte = lazy(() => import("./pages/MonCompte.tsx"));
const Admin = lazy(() => import("./pages/Admin.tsx"));
const NotFound = lazy(() => import("./pages/NotFound.tsx"));

function RouteLoading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="animate-pulse text-sm font-medium tracking-widest text-muted-foreground uppercase">
        Amanda.ZD — Chargement...
      </div>
    </div>
  );
}

/** Gestionnaire d'erreur global pour éviter tout écran blanc en cas de problème */
class RootErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean; message: string }
> {
  state = { hasError: false, message: "" };
  static getDerivedStateFromError(error: Error) {
    return {
      hasError: true,
      message: error.message || "Une erreur inattendue est survenue",
    };
  }
  componentDidCatch(err: Error) {
    console.error("[Amanda.ZD] Erreur d'exécution :", err);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-background text-foreground p-6">
          <div className="max-w-lg text-center">
            <h1 className="text-xl font-serif font-bold">Boutique Amanda.ZD</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              {this.state.message}
            </p>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RootErrorBoundary>
      <AuthProvider>
        <CartProvider>
          <CurrencyProvider>
            <BrowserRouter>
              <Suspense fallback={<RouteLoading />}>
                <Routes>
                  <Route path="/" element={<Landing />} />
                  <Route path="/boutique" element={<Boutique />} />
                  <Route path="/panier" element={<Panier />} />
                  <Route
                    path="/auth"
                    element={<AuthPage redirectAfterAuth="/mon-compte" />}
                  />
                  <Route
                    path="/mon-compte"
                    element={
                      <RequireAuth
                        title="Connectez-vous pour accéder à votre compte"
                        description="Votre espace client Boutique Amanda.ZD est réservé aux membres connectés."
                      >
                        <MonCompte />
                      </RequireAuth>
                    }
                  />
                  <Route
                    path="/admin"
                    element={
                      <RequireAuth
                        title="Espace réservé aux administrateurs"
                        description="Connectez-vous avec un compte administrateur pour accéder au tableau de bord."
                        requireAdmin
                      >
                        <Admin />
                      </RequireAuth>
                    }
                  />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </Suspense>
            </BrowserRouter>
          </CurrencyProvider>
        </CartProvider>
      </AuthProvider>
      <Toaster />
    </RootErrorBoundary>
  </StrictMode>,
);
