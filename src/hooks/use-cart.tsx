import { formatPrice, type CurrencyCode, type Product } from "@/lib/products";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export interface CartItem {
  product: Product;
  quantity: number;
  selectedSize: string;
  selectedColor: string;
}

export interface Order {
  id: string;
  userId: string;
  items: CartItem[];
  totalEur: number;
  status: "en-preparation" | "expediee" | "livree" | "annulee";
  createdAt: string;
  shippingAddress: {
    name: string;
    address: string;
    city: string;
    postalCode: string;
    country: string;
  };
}

interface CartContextValue {
  items: CartItem[];
  addItem: (product: Product, size: string, color: string) => void;
  removeItem: (productId: string, size: string, color: string) => void;
  updateQuantity: (productId: string, size: string, color: string, quantity: number) => void;
  clearCart: () => void;
  itemCount: number;
  totalEur: number;
  formatTotal: (currency: CurrencyCode) => string;
  placeOrder: (userId: string, shippingAddress: Order["shippingAddress"]) => Order;
  getOrdersForUser: (userId: string) => Order[];
  getAllOrders: () => Order[];
  updateOrderStatus: (orderId: string, status: Order["status"]) => void;
}

const CartContext = createContext<CartContextValue | null>(null);

const CART_KEY = "amanda-cart";
const ORDERS_KEY = "amanda-orders";

function getStoredCart(): CartItem[] {
  try {
    const raw = localStorage.getItem(CART_KEY);
    if (raw) return JSON.parse(raw);
  } catch {
    // ignore
  }
  return [];
}

function saveCart(items: CartItem[]) {
  localStorage.setItem(CART_KEY, JSON.stringify(items));
}

const DEMO_ORDERS: Order[] = [
  {
    id: "CMD-ZD-123456",
    userId: "123456",
    items: [
      {
        product: {
          id: "1",
          name: "Robe Soirée Satin Noir",
          description: "Robe longue drapée en satin de soie d'une finesse incomparable.",
          category: "robes",
          priceEur: 249,
          sizes: ["XS", "S", "M", "L"],
          colors: ["Noir", "Émeraude"],
          imageUrl: "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?auto=format&fit=crop&w=900&q=80",
          isNew: true,
          isActive: true,
          stock: 15,
        },
        quantity: 1,
        selectedSize: "M",
        selectedColor: "Noir",
      },
    ],
    totalEur: 249,
    status: "en-preparation",
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    shippingAddress: {
      name: "Cliente Privilège (123456)",
      address: "12 Avenue Montaigne",
      city: "Paris",
      postalCode: "75008",
      country: "France",
    },
  },
];

function getStoredOrders(): Order[] {
  try {
    const raw = localStorage.getItem(ORDERS_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch {
    // ignore
  }
  localStorage.setItem(ORDERS_KEY, JSON.stringify(DEMO_ORDERS));
  return DEMO_ORDERS;
}

function saveOrders(orders: Order[]) {
  localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
}

function itemKey(productId: string, size: string, color: string) {
  return `${productId}::${size}::${color}`;
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(getStoredCart);
  const [orders, setOrders] = useState<Order[]>(getStoredOrders);

  useEffect(() => {
    saveCart(items);
  }, [items]);

  useEffect(() => {
    saveOrders(orders);
  }, [orders]);

  const addItem = useCallback((product: Product, size: string, color: string) => {
    setItems((prev) => {
      const pid = product.id || product._id || product.name;
      const key = itemKey(pid, size, color);
      const existing = prev.find(
        (i) => itemKey(i.product.id || i.product._id || i.product.name, i.selectedSize, i.selectedColor) === key,
      );
      if (existing) {
        return prev.map((i) =>
          itemKey(i.product.id || i.product._id || i.product.name, i.selectedSize, i.selectedColor) === key
            ? { ...i, quantity: i.quantity + 1 }
            : i,
        );
      }
      return [...prev, { product, quantity: 1, selectedSize: size, selectedColor: color }];
    });
  }, []);

  const removeItem = useCallback((productId: string, size: string, color: string) => {
    const key = itemKey(productId, size, color);
    setItems((prev) =>
      prev.filter(
        (i) => itemKey(i.product.id || i.product._id || i.product.name, i.selectedSize, i.selectedColor) !== key,
      ),
    );
  }, []);

  const updateQuantity = useCallback(
    (productId: string, size: string, color: string, quantity: number) => {
      if (quantity <= 0) {
        removeItem(productId, size, color);
        return;
      }
      const key = itemKey(productId, size, color);
      setItems((prev) =>
        prev.map((i) =>
          itemKey(i.product.id || i.product._id || i.product.name, i.selectedSize, i.selectedColor) === key
            ? { ...i, quantity }
            : i,
        ),
      );
    },
    [removeItem],
  );

  const clearCart = useCallback(() => {
    setItems([]);
  }, []);

  const itemCount = useMemo(() => items.reduce((sum, i) => sum + i.quantity, 0), [items]);
  const totalEur = useMemo(() => items.reduce((sum, i) => sum + i.product.priceEur * i.quantity, 0), [items]);
  const formatTotal = useCallback(
    (currency: CurrencyCode) => formatPrice(totalEur, currency),
    [totalEur],
  );

  const placeOrder = useCallback(
    (userId: string, shippingAddress: Order["shippingAddress"]): Order => {
      const order: Order = {
        id: `CMD-${Date.now().toString(36).toUpperCase()}`,
        userId,
        items: [...items],
        totalEur,
        status: "en-preparation",
        createdAt: new Date().toISOString(),
        shippingAddress,
      };
      setOrders((prev) => [order, ...prev]);
      setItems([]);
      return order;
    },
    [items, totalEur],
  );

  const getOrdersForUser = useCallback(
    (userId: string) => orders.filter((o) => o.userId === userId),
    [orders],
  );

  const getAllOrders = useCallback(() => orders, [orders]);

  const updateOrderStatus = useCallback((orderId: string, status: Order["status"]) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status } : o)),
    );
  }, []);

  const value = useMemo<CartContextValue>(
    () => ({
      items,
      addItem,
      removeItem,
      updateQuantity,
      clearCart,
      itemCount,
      totalEur,
      formatTotal,
      placeOrder,
      getOrdersForUser,
      getAllOrders,
      updateOrderStatus,
    }),
    [items, addItem, removeItem, updateQuantity, clearCart, itemCount, totalEur, formatTotal, placeOrder, getOrdersForUser, getAllOrders, updateOrderStatus],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) {
    throw new Error("useCart doit être utilisé dans un <CartProvider>");
  }
  return ctx;
}
