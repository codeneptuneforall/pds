import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';
import { effectivePrice, getProduct } from '../utils/store';
import type { CartLine, ShopFilter } from '../types/store';

type StoreValue = {
  cart: CartLine[];
  wishlist: string[];
  cartCount: number;
  subtotal: number;
  addToCart: (productId: string, quantity?: number) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  removeFromCart: (productId: string) => void;
  toggleWishlist: (productId: string) => void;
  isWishlisted: (productId: string) => boolean;
  cartOpen: boolean;
  setCartOpen: (open: boolean) => void;
  searchOpen: boolean;
  setSearchOpen: (open: boolean) => void;
  activeProductId: string | null;
  openProduct: (productId: string | null) => void;
  activeFilter: ShopFilter;
  setActiveFilter: (filter: ShopFilter) => void;
};

const StoreContext = createContext<StoreValue | null>(null);
const STORAGE_KEY = 'puskara-demo-store-v1';

type Persisted = {cart: CartLine[];wishlist: string[];};

function loadPersisted(): Persisted {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return { cart: [], wishlist: [] };
    const parsed = JSON.parse(raw) as Persisted;
    return {
      cart: Array.isArray(parsed.cart) ? parsed.cart.filter((l) => getProduct(l.productId)) : [],
      wishlist: Array.isArray(parsed.wishlist) ? parsed.wishlist.filter((id) => getProduct(id)) : []
    };
  } catch {
    return { cart: [], wishlist: [] };
  }
}

export function StoreProvider({ children }: {children: React.ReactNode;}) {
  const [initial] = useState(loadPersisted);
  const [cart, setCart] = useState<CartLine[]>(initial.cart);
  const [wishlist, setWishlist] = useState<string[]>(initial.wishlist);
  const [cartOpen, setCartOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [activeProductId, setActiveProductId] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState<ShopFilter>('featured');

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ cart, wishlist }));
    } catch {

      /* storage unavailable — keep state in memory only */}
  }, [cart, wishlist]);

  const addToCart = useCallback((productId: string, quantity = 1) => {
    const product = getProduct(productId);
    if (!product) {
      toast.error('That item is no longer available.');
      return;
    }
    setCart((prev) => {
      const existing = prev.find((l) => l.productId === productId);
      if (existing) {
        return prev.map((l) => l.productId === productId ? { ...l, quantity: Math.min(l.quantity + quantity, 10) } : l);
      }
      return [...prev, { productId, quantity: Math.min(quantity, 10) }];
    });
    toast.success(`${product.name} added to your bag`);
  }, []);

  const updateQuantity = useCallback((productId: string, quantity: number) => {
    setCart((prev) =>
    quantity <= 0 ?
    prev.filter((l) => l.productId !== productId) :
    prev.map((l) => l.productId === productId ? { ...l, quantity: Math.min(quantity, 10) } : l)
    );
  }, []);

  const removeFromCart = useCallback((productId: string) => {
    const product = getProduct(productId);
    setCart((prev) => prev.filter((l) => l.productId !== productId));
    if (product) toast(`${product.name} removed from your bag`);
  }, []);

  const toggleWishlist = useCallback((productId: string) => {
    const product = getProduct(productId);
    setWishlist((prev) => {
      const has = prev.includes(productId);
      if (product) toast(has ? `Removed ${product.name} from your wishlist` : `Saved ${product.name} to your wishlist`);
      return has ? prev.filter((id) => id !== productId) : [...prev, productId];
    });
  }, []);

  const value = useMemo<StoreValue>(() => {
    const cartCount = cart.reduce((n, l) => n + l.quantity, 0);
    const subtotal = cart.reduce((sum, l) => {
      const p = getProduct(l.productId);
      return p ? sum + effectivePrice(p) * l.quantity : sum;
    }, 0);
    return {
      cart,
      wishlist,
      cartCount,
      subtotal,
      addToCart,
      updateQuantity,
      removeFromCart,
      toggleWishlist,
      isWishlisted: (id) => wishlist.includes(id),
      cartOpen,
      setCartOpen,
      searchOpen,
      setSearchOpen,
      activeProductId,
      openProduct: setActiveProductId,
      activeFilter,
      setActiveFilter
    };
  }, [cart, wishlist, addToCart, updateQuantity, removeFromCart, toggleWishlist, cartOpen, searchOpen, activeProductId, activeFilter]);

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error('useStore must be used within StoreProvider');
  return ctx;
}