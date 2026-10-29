import { products } from '../data/products';
import { collections } from '../data/collections';
import type { Product, ShopFilter } from '../types/store';

const inr = new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 });

export function formatINR(value: number) {
  return inr.format(value);
}

export function effectivePrice(product: Product) {
  return product.salePrice ?? product.price;
}

export function getProduct(id: string | null) {
  if (!id) return undefined;
  return products.find((p) => p.id === id);
}

export function getCollectionTitle(id: string) {
  return collections.find((c) => c.id === id)?.title ?? '';
}

export function filterProducts(filter: ShopFilter) {
  if (filter === 'all') return products;
  if (filter === 'featured') return products.filter((p) => p.featured);
  return products.filter((p) => p.collectionId === filter);
}

export function searchProducts(query: string) {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  return products.filter((p) =>
  [p.name, p.summary, getCollectionTitle(p.collectionId)].some((field) => field.toLowerCase().includes(q))
  );
}

export function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value.trim());
}

export function scrollToId(id: string) {
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const behavior: ScrollBehavior = reduce ? 'auto' : 'smooth';
  if (id === 'top') {
    window.scrollTo({ top: 0, behavior });
    return;
  }
  const el = document.getElementById(id);
  if (!el) return;
  const top = el.getBoundingClientRect().top + window.scrollY - 80;
  window.scrollTo({ top, behavior });
}