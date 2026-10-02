import {
  CURRENCIES,
  CURRENCY_CODES,
  type CurrencyCode,
} from "@/lib/products";
import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";

type CurrencyContextValue = {
  currency: CurrencyCode;
  setCurrency: (c: CurrencyCode) => void;
};

const CurrencyContext = createContext<CurrencyContextValue | null>(null);

const STORAGE_KEY = "amanda-currency";

function readInitialCurrency(): CurrencyCode {
  if (typeof window === "undefined") return "EUR";
  const stored = window.localStorage.getItem(STORAGE_KEY);
  if (stored && (CURRENCY_CODES as string[]).includes(stored)) {
    return stored as CurrencyCode;
  }
  return "EUR";
}

export function CurrencyProvider({ children }: { children: ReactNode }) {
  const [currency, setCurrencyState] = useState<CurrencyCode>(
    readInitialCurrency,
  );

  const setCurrency = useCallback((c: CurrencyCode) => {
    setCurrencyState(c);
    try {
      window.localStorage.setItem(STORAGE_KEY, c);
    } catch {
      // stockage indisponible : on ignore silencieusement
    }
  }, []);

  const value = useMemo(
    () => ({ currency, setCurrency }),
    [currency, setCurrency],
  );

  return (
    <CurrencyContext.Provider value={value}>{children}</CurrencyContext.Provider>
  );
}

export function useCurrency(): CurrencyContextValue {
  const ctx = useContext(CurrencyContext);
  if (!ctx) throw new Error("useCurrency doit être utilisé dans CurrencyProvider");
  return ctx;
}

/** Petit sélecteur de devise pour le header. */
export function CurrencySelect({
  value,
  onChange,
  className,
}: {
  value: CurrencyCode;
  onChange: (c: CurrencyCode) => void;
  className?: string;
}) {
  return (
    <label className={className}>
      <span className="sr-only">Devise</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value as CurrencyCode)}
        className="cursor-pointer appearance-none bg-transparent py-1.5 pl-3 pr-7 text-xs uppercase tracking-[0.14em] text-foreground/80 outline-none transition-colors hover:text-foreground"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='6' viewBox='0 0 10 6'%3E%3Cpath d='M1 1l4 4 4-4' fill='none' stroke='%23777' stroke-width='1.5'/%3E%3C/svg%3E\")",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "right 4px center",
        }}
      >
        {CURRENCY_CODES.map((code) => (
          <option key={code} value={code}>
            {CURRENCIES[code].label}
          </option>
        ))}
      </select>
    </label>
  );
}
