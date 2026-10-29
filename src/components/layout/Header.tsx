import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { HeartIcon, MenuIcon, SearchIcon, ShoppingBagIcon, UserIcon, XIcon } from 'lucide-react';
import { toast } from 'sonner';
import { BrandMark } from '../BrandMark';
import { navigation } from '../../data/siteContent';
import { scrollToId } from '../../utils/store';
import { useStore } from '../../contexts/StoreContext';

const iconButton =
'relative inline-flex h-10 w-10 items-center justify-center rounded-full text-charcoal transition-colors duration-150 hover:bg-charcoal/[0.06] focus-visible:outline focus-visible:outline-2 focus-visible:outline-maroon';

export function Header() {
  const { cartCount, wishlist, setCartOpen, setSearchOpen, setActiveFilter } = useStore();
  const [menuOpen, setMenuOpen] = useState(false);

  const go = (target: string) => {
    setMenuOpen(false);
    if (target === 'shop') setActiveFilter('all');
    scrollToId(target);
  };

  return (
    <header className="fixed inset-x-3 top-3 z-50 lg:inset-x-6 lg:top-4">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between rounded-full border border-charcoal/10 bg-ivory/90 pl-3 pr-2 shadow-[0_6px_24px_-12px_rgba(33,27,24,0.35)] backdrop-blur-md lg:pl-5">
        <button type="button" onClick={() => go('top')} className="flex items-center gap-2.5 rounded-full focus-visible:outline focus-visible:outline-2 focus-visible:outline-maroon" aria-label="Puskara Divinity Store — home">
          <BrandMark />
          <span className="flex flex-col items-start leading-none">
            <span className="whitespace-nowrap font-display text-xl font-semibold text-maroon">Puskara</span>
            <span className="hidden whitespace-nowrap text-[10px] tracking-[0.2em] text-charcoal/60 sm:block">DIVINITY STORE</span>
          </span>
        </button>

        <nav aria-label="Primary" className="hidden lg:block">
          <ul className="flex items-center gap-8">
            {navigation.map((item) =>
            <li key={item.target}>
                <button type="button" onClick={() => go(item.target)} className="whitespace-nowrap text-sm text-charcoal/80 transition-colors duration-150 hover:text-maroon focus-visible:outline focus-visible:outline-2 focus-visible:outline-maroon">
                  {item.label}
                </button>
              </li>
            )}
          </ul>
        </nav>

        <div className="flex items-center">
          <button type="button" className={iconButton} aria-label="Search the store" onClick={() => setSearchOpen(true)}>
            <SearchIcon className="h-[18px] w-[18px]" />
          </button>
          <button type="button" className={`${iconButton} hidden sm:inline-flex`} aria-label="Account" onClick={() => toast("Account sign-in isn't connected in this demo.")}>
            <UserIcon className="h-[18px] w-[18px]" />
          </button>
          <button type="button" className={`${iconButton} hidden sm:inline-flex`} aria-label={`Wishlist, ${wishlist.length} saved`} onClick={() => go('shop')}>
            <HeartIcon className="h-[18px] w-[18px]" />
            {wishlist.length > 0 && <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-maroon" />}
          </button>
          <button type="button" className={iconButton} aria-label={`Shopping bag, ${cartCount} items`} onClick={() => setCartOpen(true)}>
            <ShoppingBagIcon className="h-[18px] w-[18px]" />
            {cartCount > 0 &&
            <span className="absolute -right-0.5 -top-0.5 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-maroon px-1 text-[10px] font-semibold text-ivory">
                {cartCount}
              </span>
            }
          </button>
          <button type="button" className={`${iconButton} lg:hidden`} aria-label={menuOpen ? 'Close menu' : 'Open menu'} aria-expanded={menuOpen} onClick={() => setMenuOpen((v) => !v)}>
            {menuOpen ? <XIcon className="h-5 w-5" /> : <MenuIcon className="h-5 w-5" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {menuOpen &&
        <motion.nav
          aria-label="Mobile"
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.18, ease: [0.23, 1, 0.32, 1] }}
          className="mx-auto mt-2 max-w-7xl rounded-3xl border border-charcoal/10 bg-ivory p-3 shadow-lg lg:hidden">
          
            <ul className="flex flex-col">
              {navigation.map((item) =>
            <li key={item.target}>
                  <button type="button" onClick={() => go(item.target)} className="w-full rounded-2xl px-4 py-3 text-left font-display text-xl text-charcoal transition-colors duration-150 hover:bg-charcoal/[0.05]">
                    {item.label}
                  </button>
                </li>
            )}
            </ul>
          </motion.nav>
        }
      </AnimatePresence>
    </header>);

}