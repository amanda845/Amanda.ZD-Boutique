import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export interface User {
  id: string;
  email: string;
  name?: string;
  role: "client" | "admin";
  isAnonymous?: boolean;
  createdAt: string;
}

interface AuthContextValue {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  isAdmin: boolean;
  signIn: (email: string, password: string) => Promise<User>;
  signUp: (email: string, password: string, name: string) => Promise<User>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

const USERS_KEY = "amanda-users";
const SESSION_KEY = "amanda-session";

// Admin par défaut — identifiant : admin@amanda.zd / admin123
const DEFAULT_ADMIN: User = {
  id: "admin-001",
  email: "admin@amanda.zd",
  name: "Amanda (Admin)",
  role: "admin",
  createdAt: new Date().toISOString(),
};

function getStoredUsers(): Record<string, { user: User; password: string }> {
  try {
    const raw = localStorage.getItem(USERS_KEY);
    if (raw) return JSON.parse(raw);
  } catch {
    // ignore
  }
  // Initialiser avec l'admin par défaut
  const defaults: Record<string, { user: User; password: string }> = {
    [DEFAULT_ADMIN.email]: { user: DEFAULT_ADMIN, password: "admin123" },
  };
  localStorage.setItem(USERS_KEY, JSON.stringify(defaults));
  return defaults;
}

function saveUsers(users: Record<string, { user: User; password: string }>) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

function getStoredSession(): User | null {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    if (raw) return JSON.parse(raw);
  } catch {
    // ignore
  }
  return null;
}

function saveSession(user: User | null) {
  if (user) {
    localStorage.setItem(SESSION_KEY, JSON.stringify(user));
  } else {
    localStorage.removeItem(SESSION_KEY);
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Restaurer la session au montage
  useEffect(() => {
    const session = getStoredSession();
    if (session) {
      setUser(session);
    }
    setIsLoading(false);
  }, []);

  const signIn = useCallback(async (email: string, password: string): Promise<User> => {
    const users = getStoredUsers();
    const entry = users[email.toLowerCase().trim()];
    if (!entry || entry.password !== password) {
      throw new Error("Identifiants invalides. Vérifiez votre e-mail et mot de passe.");
    }
    setUser(entry.user);
    saveSession(entry.user);
    return entry.user;
  }, []);

  const signUp = useCallback(async (email: string, password: string, name: string): Promise<User> => {
    const users = getStoredUsers();
    const key = email.toLowerCase().trim();
    if (users[key]) {
      throw new Error("Un compte existe déjà avec cette adresse e-mail.");
    }
    const newUser: User = {
      id: `user-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      email: key,
      name: name.trim(),
      role: "client",
      createdAt: new Date().toISOString(),
    };
    users[key] = { user: newUser, password };
    saveUsers(users);
    setUser(newUser);
    saveSession(newUser);
    return newUser;
  }, []);

  const signOut = useCallback(async () => {
    setUser(null);
    saveSession(null);
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      isLoading,
      isAuthenticated: !!user,
      isAdmin: user?.role === "admin",
      signIn,
      signUp,
      signOut,
    }),
    [user, isLoading, signIn, signUp, signOut],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth doit être utilisé dans un <AuthProvider>");
  }
  return ctx;
}
