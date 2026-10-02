import { Button } from "@/components/ui/button";
import { Wordmark } from "@/components/shop/SiteHeader";
import { motion } from "framer-motion";
import { useNavigate } from "react-router";

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="flex min-h-screen flex-col items-center justify-center bg-secondary/40 px-4 text-center"
    >
      <Wordmark className="mb-10" />
      <p className="font-display text-7xl font-semibold text-foreground">404</p>
      <p className="mt-4 font-display text-2xl italic text-foreground/80">
        Cette page s'est égarée dans l'atelier.
      </p>
      <p className="mt-2 text-sm text-muted-foreground">
        La page que vous cherchez n'existe pas ou a été déplacée.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Button onClick={() => navigate("/")}>Retour à l'accueil</Button>
        <Button variant="outline" onClick={() => navigate("/boutique")}>
          Voir la boutique
        </Button>
      </div>
    </motion.div>
  );
}
