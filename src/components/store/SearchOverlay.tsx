import React, { useCallback, useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { SearchIcon, XIcon } from 'lucide-react';
import { ProductImage } from './ProductImage';
import { PriceTag } from './PriceTag';
import { getCollectionTitle, searchProducts } from '../../utils/store';
import { useStore } from '../../contexts/StoreContext';
import { useOverlay } from '../../hooks/useOverlay';

const SUGGESTIONS = ['Idol', 'Vel', 'Diya', 'Gift'];

export function SearchOverlay() {
  const { searchOpen, setSearchOpen, openProduct } = useStore();
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const close = useCallback(() => setSearchOpen(false), [setSearchOpen]);
  useOverlay(searchOpen, close, inputRef);

  useEffect(() => {
    if (!searchOpen) setQuery('');
  }, [searchOpen]);

  const results = searchProducts(query);

  return (
    <AnimatePresence>
      {searchOpen &&
      <motion.div key="search" className="fixed inset-0 z-[60]" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.18 }}>
          <div className="absolute inset-0 bg-charcoal/55" onClick={close} aria-hidden="true" />
          <motion.div
          role="dialog"
          aria-modal="true"
          aria-label="Search products"
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.22, ease: [0.23, 1, 0.32, 1] }}
          className="relative mx-auto mt-3 w-[calc(100%-1.5rem)] max-w-2xl rounded-3xl bg-ivory p-3 shadow-2xl lg:mt-20">
          
            <div className="flex items-center gap-3 rounded-2xl border border-charcoal/15 px-4">
              <SearchIcon className="h-5 w-5 text-charcoal/50" />
              <label htmlFor="store-search" className="sr-only">
                Search products
              </label>
              <input
              id="store-search"
              ref={inputRef}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search idols, lamps, gifts…"
              className="h-14 flex-1 bg-transparent text-base text-charcoal placeholder:text-charcoal/45 focus:outline-none" />
            
              <button type="button" onClick={close} aria-label="Close search" className="inline-flex h-9 w-9 items-center justify-center rounded-full transition-colors duration-150 hover:bg-charcoal/[0.07]">
                <XIcon className="h-4 w-4" />
              </button>
            </div>

            <div className="max-h-[60svh] overflow-y-auto px-1 pb-1 pt-3">
              {!query.trim() ?
            <div className="px-3 py-2">
                  <p className="text-xs text-charcoal/55">Try</p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {SUGGESTIONS.map((s) =>
                <button key={s} type="button" onClick={() => setQuery(s)} className="rounded-full border border-charcoal/15 px-3 py-1.5 text-sm text-charcoal/80 transition-colors duration-150 hover:border-charcoal/40">
                        {s}
                      </button>
                )}
                  </div>
                </div> :
            results.length === 0 ?
            <p className="px-3 py-8 text-center text-sm text-charcoal/60">No matches for “{query}”. Try a different word.</p> :

            <ul aria-live="polite">
                  {results.map((p) =>
              <li key={p.id}>
                      <button
                  type="button"
                  onClick={() => {
                    close();
                    openProduct(p.id);
                  }}
                  className="flex w-full items-center gap-4 rounded-2xl p-2.5 text-left transition-colors duration-150 hover:bg-charcoal/[0.05] focus-visible:outline focus-visible:outline-2 focus-visible:outline-maroon">
                  
                        <ProductImage src={p.image} alt="" className="h-14 w-14 shrink-0 rounded-xl" />
                        <span className="min-w-0 flex-1">
                          <span className="block font-display text-lg font-semibold leading-tight text-charcoal">{p.name}</span>
                          <span className="block text-xs text-charcoal/55">{getCollectionTitle(p.collectionId)}</span>
                        </span>
                        <PriceTag product={p} />
                      </button>
                    </li>
              )}
                </ul>
            }
            </div>
          </motion.div>
        </motion.div>
      }
    </AnimatePresence>);

}