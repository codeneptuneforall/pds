import React, { useCallback, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ShoppingBagIcon, Trash2Icon, XIcon } from 'lucide-react';
import { toast } from 'sonner';
import { ProductImage } from './ProductImage';
import { QuantityStepper } from './QuantityStepper';
import { effectivePrice, formatINR, getProduct, scrollToId } from '../../utils/store';
import { useStore } from '../../contexts/StoreContext';
import { useOverlay } from '../../hooks/useOverlay';

export function CartDrawer() {
  const { cart, cartOpen, setCartOpen, updateQuantity, removeFromCart, subtotal, cartCount } = useStore();
  const closeRef = useRef<HTMLButtonElement>(null);
  const close = useCallback(() => setCartOpen(false), [setCartOpen]);
  useOverlay(cartOpen, close, closeRef);

  return (
    <AnimatePresence>
      {cartOpen &&
      <motion.div key="cart" className="fixed inset-0 z-[60]" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
          <div className="absolute inset-0 bg-charcoal/50" onClick={close} aria-hidden="true" />
          <motion.aside
          role="dialog"
          aria-modal="true"
          aria-labelledby="cart-title"
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ duration: 0.28, ease: [0.23, 1, 0.32, 1] }}
          className="absolute right-0 top-0 flex h-full w-full max-w-md flex-col bg-ivory">
          
            <div className="flex items-center justify-between border-b border-charcoal/10 px-6 py-5">
              <h2 id="cart-title" className="font-display text-2xl font-semibold text-charcoal">
                Your bag {cartCount > 0 && <span className="text-charcoal/50">({cartCount})</span>}
              </h2>
              <button ref={closeRef} type="button" onClick={close} aria-label="Close bag" className="inline-flex h-10 w-10 items-center justify-center rounded-full transition-colors duration-150 hover:bg-charcoal/[0.07] focus-visible:outline focus-visible:outline-2 focus-visible:outline-maroon">
                <XIcon className="h-5 w-5" />
              </button>
            </div>

            {cart.length === 0 ?
          <div className="flex flex-1 flex-col items-center justify-center px-8 text-center">
                <span className="flex h-14 w-14 items-center justify-center rounded-full bg-sandstone text-maroon">
                  <ShoppingBagIcon className="h-6 w-6" />
                </span>
                <p className="mt-5 font-display text-2xl text-charcoal">Your bag is empty</p>
                <p className="mt-2 text-sm text-charcoal/65">Find something that brings the divine into your home.</p>
                <button
              type="button"
              onClick={() => {
                close();
                scrollToId('collections');
              }}
              className="mt-6 rounded-full bg-charcoal px-5 py-3 text-sm font-medium text-ivory transition-colors duration-150 hover:bg-maroon">
              
                  Explore collections
                </button>
              </div> :

          <>
                <ul className="flex-1 divide-y divide-charcoal/10 overflow-y-auto px-6">
                  {cart.map((line) => {
                const p = getProduct(line.productId);
                if (!p) return null;
                return (
                  <li key={line.productId} className="flex gap-4 py-5">
                        <ProductImage src={p.image} alt={p.name} className="h-20 w-20 shrink-0 rounded-xl" />
                        <div className="flex min-w-0 flex-1 flex-col">
                          <div className="flex items-start justify-between gap-3">
                            <p className="font-display text-lg font-semibold leading-tight text-charcoal">{p.name}</p>
                            <p className="whitespace-nowrap text-sm font-medium text-charcoal">{formatINR(effectivePrice(p) * line.quantity)}</p>
                          </div>
                          <p className="mt-0.5 text-xs text-charcoal/55">{formatINR(effectivePrice(p))} each</p>
                          <div className="mt-auto flex items-center justify-between pt-3">
                            <QuantityStepper value={line.quantity} onChange={(q) => updateQuantity(p.id, q)} label={`Quantity of ${p.name}`} />
                            <button type="button" onClick={() => removeFromCart(p.id)} aria-label={`Remove ${p.name}`} className="inline-flex h-9 w-9 items-center justify-center rounded-full text-charcoal/60 transition-colors duration-150 hover:bg-charcoal/[0.07] hover:text-maroon">
                              <Trash2Icon className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      </li>);

              })}
                </ul>
                <div className="border-t border-charcoal/10 px-6 py-5">
                  <div className="flex items-baseline justify-between">
                    <span className="text-sm text-charcoal/70">Subtotal</span>
                    <span className="text-xl font-semibold text-charcoal">{formatINR(subtotal)}</span>
                  </div>
                  <p className="mt-1 text-xs text-charcoal/55">Shipping and taxes are calculated at checkout.</p>
                  <button
                type="button"
                onClick={() => toast("Checkout isn't connected in this demo — no order was placed and no payment was taken.")}
                className="mt-4 w-full rounded-full bg-maroon px-5 py-3.5 text-sm font-semibold text-ivory transition-colors duration-150 hover:bg-maroon-light focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-maroon">
                
                    Proceed to checkout
                  </button>
                </div>
              </>
          }
          </motion.aside>
        </motion.div>
      }
    </AnimatePresence>);

}