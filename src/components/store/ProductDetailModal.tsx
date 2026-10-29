import React, { useCallback, useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { CheckIcon, HeartIcon, ShoppingBagIcon, XIcon } from 'lucide-react';
import { ProductImage } from './ProductImage';
import { PriceTag } from './PriceTag';
import { QuantityStepper } from './QuantityStepper';
import { getCollectionTitle, getProduct } from '../../utils/store';
import { useStore } from '../../contexts/StoreContext';
import { useOverlay } from '../../hooks/useOverlay';

export function ProductDetailModal() {
  const { activeProductId, openProduct, addToCart, toggleWishlist, isWishlisted } = useStore();
  const product = getProduct(activeProductId);
  const [qty, setQty] = useState(1);
  const closeRef = useRef<HTMLButtonElement>(null);
  const close = useCallback(() => openProduct(null), [openProduct]);
  useOverlay(Boolean(product), close, closeRef);

  useEffect(() => setQty(1), [activeProductId]);

  return (
    <AnimatePresence>
      {product &&
      <motion.div
        key="product-modal"
        className="fixed inset-0 z-[60] flex items-end justify-center p-0 sm:items-center sm:p-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2, ease: [0.23, 1, 0.32, 1] }}>
        
          <div className="absolute inset-0 bg-charcoal/60" onClick={close} aria-hidden="true" />
          <motion.div
          role="dialog"
          aria-modal="true"
          aria-labelledby="product-title"
          initial={{ opacity: 0, y: 24, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 16, scale: 0.98 }}
          transition={{ duration: 0.25, ease: [0.23, 1, 0.32, 1] }}
          className="relative grid max-h-[92svh] w-full max-w-4xl overflow-y-auto rounded-t-3xl bg-ivory sm:rounded-3xl md:grid-cols-2">
          
            <ProductImage src={product.image} alt={product.name} className="aspect-square w-full md:aspect-auto md:min-h-full" />
            <div className="flex flex-col p-6 md:p-8">
              <div className="flex items-start justify-between gap-4">
                <p className="text-xs font-medium tracking-[0.2em] text-maroon">{getCollectionTitle(product.collectionId).toUpperCase()}</p>
                <button
                ref={closeRef}
                type="button"
                onClick={close}
                aria-label="Close product details"
                className="-mr-2 -mt-2 inline-flex h-10 w-10 items-center justify-center rounded-full transition-colors duration-150 hover:bg-charcoal/[0.07] focus-visible:outline focus-visible:outline-2 focus-visible:outline-maroon">
                
                  <XIcon className="h-5 w-5" />
                </button>
              </div>
              <h2 id="product-title" className="mt-2 font-display text-3xl font-semibold leading-tight text-charcoal md:text-4xl">
                {product.name}
              </h2>
              <div className="mt-3">
                <PriceTag product={product} size="lg" />
              </div>
              <p className="mt-5 leading-relaxed text-charcoal/75">{product.description}</p>
              <ul className="mt-5 space-y-2 border-t border-charcoal/10 pt-5">
                {product.details.map((d) =>
              <li key={d} className="flex items-start gap-2.5 text-sm text-charcoal/80">
                    <CheckIcon className="mt-0.5 h-4 w-4 shrink-0 text-emerald" />
                    {d}
                  </li>
              )}
              </ul>
              <div className="mt-auto flex flex-wrap items-center gap-3 pt-8">
                <QuantityStepper value={qty} onChange={setQty} label={`Quantity of ${product.name}`} />
                <button
                type="button"
                onClick={() => {
                  addToCart(product.id, qty);
                  close();
                }}
                className="inline-flex flex-1 items-center justify-center gap-2 whitespace-nowrap rounded-full bg-charcoal px-5 py-3 text-sm font-medium text-ivory transition-colors duration-150 hover:bg-maroon focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-maroon">
                
                  <ShoppingBagIcon className="h-4 w-4" />
                  Add to bag
                </button>
                <button
                type="button"
                onClick={() => toggleWishlist(product.id)}
                aria-pressed={isWishlisted(product.id)}
                aria-label={isWishlisted(product.id) ? 'Remove from wishlist' : 'Save to wishlist'}
                className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-charcoal/15 transition-colors duration-150 hover:border-charcoal/40 focus-visible:outline focus-visible:outline-2 focus-visible:outline-maroon">
                
                  <HeartIcon className={`h-[18px] w-[18px] ${isWishlisted(product.id) ? 'fill-maroon text-maroon' : ''}`} />
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      }
    </AnimatePresence>);

}