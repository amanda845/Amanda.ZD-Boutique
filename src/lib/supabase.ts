import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Alerte préventive si les clés ne sont pas encore renseignées dans le .env
if (!supabaseUrl || !supabaseAnonKey) {
  console.warn(
    "[Boutique Amanda.ZD] Configuration Supabase incomplète : veuillez renseigner VITE_SUPABASE_URL et VITE_SUPABASE_ANON_KEY dans votre fichier .env.",
  );
}

// Client Supabase initialisé (avec fallback propre pour éviter tout crash avant saisie des clés)
export const supabase = createClient(
  supabaseUrl || "https://placeholder.supabase.co",
  supabaseAnonKey || "placeholder-anon-key",
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
    },
  },
);
