import React from 'react';
import { ProductCard } from './ProductCard';
import { collections } from '../../data/collections';
import { filterProducts } from '../../utils/store';
import { useStore } from '../../contexts/StoreContext';
import type { ShopFilter } from '../../types/store';

const FILTERS: {id: ShopFilter;label: string;}[] = [
{ id: 'featured', label: 'Featured' },
{ id: 'all', label: 'All' },
...collections.map((c) => ({ id: c.id as ShopFilter, label: c.title }))];


/** Section 8 — Featured products and storefront. */
export function ShopSection() {
  const { activeFilter, setActiveFilter } = useStore();
  const items = filterProducts(activeFilter);

  return (
    <section id="shop" aria-labelledby="shop-title" className="relative bg-parchment py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 lg:px-12">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h2 id="shop-title" className="font-display text-4xl font-medium leading-[1.02] text-charcoal sm:text-5xl lg:text-6xl">
              Bring Home What Inspires You.
            </h2>
            <p className="mt-3 text-sm text-charcoal/60">Demo catalogue — products, prices, and details are illustrative.</p>
          </div>
        </div>

        <div role="tablist" aria-label="Filter products" className="no-scrollbar -mx-4 mt-8 flex gap-2 overflow-x-auto px-4 lg:mx-0 lg:px-0">
          {FILTERS.map((f) => {
            const active = activeFilter === f.id;
            return (
              <button
                key={f.id}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => setActiveFilter(f.id)}
                className={`whitespace-nowrap rounded-full border px-4 py-2 text-sm transition-colors duration-150 focus-visible:outline focus-visible:outline-2 focus-visible:outline-maroon ${
                active ? 'border-charcoal bg-charcoal text-ivory' : 'border-charcoal/15 text-charcoal/80 hover:border-charcoal/40'}`
                }>
                
                {f.label}
              </button>);

          })}
        </div>

        {items.length === 0 ?
        <p className="mt-12 rounded-2xl border border-dashed border-charcoal/20 p-10 text-center text-charcoal/60">
            No products in this collection yet.
          </p> :

        <div role="tabpanel" className="mt-10 grid grid-cols-2 gap-x-4 gap-y-10 lg:grid-cols-4 lg:gap-x-6">
            {items.map((p) =>
          <ProductCard key={p.id} product={p} />
          )}
          </div>
        }
      </div>
    </section>);

}