export type ProductId = string;

export interface Product {
  _id?: ProductId;
  id?: string;
  name: string;
  description: string;
  category: "robes" | "hauts" | "bas" | "manteaux" | "accessoires";
  priceEur: number;
  sizes: string[];
  colors: string[];
  imageUrl: string;
  isNew: boolean;
  isActive: boolean;
  stock?: number;
}

/** Devises proposées à la clientèle internationale. */
export const CURRENCIES = {
  EUR: { code: "EUR", symbol: "€", rate: 1, label: "EUR €" },
  USD: { code: "USD", symbol: "$", rate: 1.09, label: "USD $" },
  GBP: { code: "GBP", symbol: "£", rate: 0.85, label: "GBP £" },
  CHF: { code: "CHF", symbol: "CHF", rate: 0.96, label: "CHF" },
  AED: { code: "AED", symbol: "AED", rate: 4.0, label: "AED" },
  JPY: { code: "JPY", symbol: "¥", rate: 165, label: "JPY ¥" },
} as const;

export type CurrencyCode = keyof typeof CURRENCIES;
export const CURRENCY_CODES = Object.keys(CURRENCIES) as CurrencyCode[];

/** Formate un prix EUR vers la devise choisie. */
export function formatPrice(priceEur: number, currency: CurrencyCode): string {
  const c = CURRENCIES[currency];
  const converted = priceEur * c.rate;
  const withDecimals =
    currency === "EUR" ||
    currency === "USD" ||
    currency === "GBP" ||
    currency === "CHF";
  const value = new Intl.NumberFormat("fr-FR", {
    minimumFractionDigits: withDecimals && converted % 1 !== 0 ? 2 : 0,
    maximumFractionDigits: withDecimals ? 2 : 0,
  }).format(converted);
  if (currency === "EUR") return `${value} €`;
  if (currency === "USD" || currency === "GBP" || currency === "JPY")
    return `${c.symbol}${value}`;
  return `${value} ${c.symbol}`;
}

export const CATEGORY_LABELS: Record<Product["category"], string> = {
  robes: "Robes",
  hauts: "Hauts",
  bas: "Bas",
  manteaux: "Manteaux",
  accessoires: "Accessoires",
};

export const CATEGORY_ORDER: Product["category"][] = [
  "robes",
  "hauts",
  "bas",
  "manteaux",
  "accessoires",
];

export const DEFAULT_PRODUCTS: Product[] = [
  {
    id: "1",
    name: "Tailleur Blazer Lilas Couture",
    description: "Veste structurée en crêpe de laine lilas, coupe moderne et revers raffiné.",
    category: "hauts",
    priceEur: 285,
    sizes: ["36", "38", "40", "42"],
    colors: ["Lilas Poudré", "Noir Obsidienne"],
    imageUrl: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=900&q=80",
    isNew: true,
    isActive: true,
    stock: 14,
  },
  {
    id: "2",
    name: "Robe Soirée Satin Noir",
    description: "Robe longue drapée en satin de soie noir profond d'une finesse incomparable.",
    category: "robes",
    priceEur: 249,
    sizes: ["XS", "S", "M", "L"],
    colors: ["Noir Intense", "Violet Impérial"],
    imageUrl: "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?auto=format&fit=crop&w=900&q=80",
    isNew: true,
    isActive: true,
    stock: 15,
  },
  {
    id: "3",
    name: "Chemisier Soie Lavande",
    description: "Chemisier fluide à col lavallière, confectionné dans une soie douce aux reflets lilas.",
    category: "hauts",
    priceEur: 159,
    sizes: ["S", "M", "L"],
    colors: ["Lavande Douce", "Blanc Nacre"],
    imageUrl: "https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=900&q=80",
    isNew: true,
    isActive: true,
    stock: 20,
  },
  {
    id: "4",
    name: "Sac Baguette Cuir Lilas",
    description: "Maroquinerie d'exception en cuir d'Italie grainé avec chaîne métallique argentée.",
    category: "accessoires",
    priceEur: 210,
    sizes: ["Unique"],
    colors: ["Lilas", "Noir Onyx"],
    imageUrl: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=900&q=80",
    isNew: true,
    isActive: true,
    stock: 9,
  },
  {
    id: "5",
    name: "Manteau Ceinturé Noir Obsidienne",
    description: "Manteau structuré en drap de laine double face et cachemire doux pour l'hiver.",
    category: "manteaux",
    priceEur: 440,
    sizes: ["36", "38", "40", "42"],
    colors: ["Noir Obsidienne", "Anthracite"],
    imageUrl: "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=900&q=80",
    isNew: false,
    isActive: true,
    stock: 8,
  },
  {
    id: "6",
    name: "Pantalon Tailleur Évasé",
    description: "Coupe haute flatteuse avec plis avant marqués pour une démarche élancée et confiante.",
    category: "bas",
    priceEur: 175,
    sizes: ["34", "36", "38", "40"],
    colors: ["Noir", "Lilas Poudré"],
    imageUrl: "https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?auto=format&fit=crop&w=900&q=80",
    isNew: false,
    isActive: true,
    stock: 18,
  },
  {
    id: "7",
    name: "Robe Fourreau Nuit Violette",
    description: "Une silhouette sculptée coupée dans un crêpe de soie lourd nuance violette nocturne.",
    category: "robes",
    priceEur: 260,
    sizes: ["XS", "S", "M", "L"],
    colors: ["Violet Nuit", "Noir"],
    imageUrl: "https://images.unsplash.com/photo-1469334031218-e382a71b716b?auto=format&fit=crop&w=900&q=80",
    isNew: true,
    isActive: true,
    stock: 11,
  },
  {
    id: "8",
    name: "Pull Cachemire Mauve Pâle",
    description: "Col cheminée en pur cachemire peigné, d'une légèreté et douceur sans pareilles.",
    category: "hauts",
    priceEur: 195,
    sizes: ["S", "M", "L"],
    colors: ["Mauve Pâle", "Noir"],
    imageUrl: "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?auto=format&fit=crop&w=900&q=80",
    isNew: false,
    isActive: true,
    stock: 12,
  },
];
