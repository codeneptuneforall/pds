import React from 'react';
import { BrandMark } from '../BrandMark';
import { NewsletterForm } from './NewsletterForm';
import { collections } from '../../data/collections';
import { helpTopics, socialLinks } from '../../data/siteContent';
import { scrollToId } from '../../utils/store';
import { useStore } from '../../contexts/StoreContext';
import type { CollectionId } from '../../types/store';

const HELP_LINKS = ['shipping', 'returns', 'care', 'privacy', 'terms'];

export function Footer() {
  const { setActiveFilter } = useStore();
  const link = 'text-sm text-ivory/70 transition-colors duration-150 hover:text-gold text-left';

  return (
    <footer className="relative z-10 bg-charcoal text-ivory">
      <div className="mx-auto max-w-7xl px-4 py-16 lg:px-12">
        <div className="grid gap-10 border-b border-ivory/10 pb-12 lg:grid-cols-12 lg:items-center">
          <div className="lg:col-span-6">
            <p className="font-display text-3xl leading-tight sm:text-4xl">Festival edits, new arrivals, and quiet inspiration.</p>
          </div>
          <div className="lg:col-span-5 lg:col-start-8">
            <NewsletterForm />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-10 py-12 md:grid-cols-4">
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2.5">
              <BrandMark />
              <span className="font-display text-xl font-semibold">Puskara</span>
            </div>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-ivory/60">Devotional treasures inspired by Lord Murugan and South Indian heritage.</p>
          </div>
          <nav aria-label="Shop">
            <p className="text-xs tracking-[0.2em] text-gold">SHOP</p>
            <ul className="mt-4 space-y-2.5">
              {collections.map((c) =>
              <li key={c.id}>
                  <button
                  type="button"
                  className={link}
                  onClick={() => {
                    setActiveFilter(c.id as CollectionId);
                    scrollToId('shop');
                  }}>
                  
                    {c.title}
                  </button>
                </li>
              )}
            </ul>
          </nav>
          <nav aria-label="Help">
            <p className="text-xs tracking-[0.2em] text-gold">HELP</p>
            <ul className="mt-4 space-y-2.5">
              {helpTopics.
              filter((t) => HELP_LINKS.includes(t.id)).
              map((t) =>
              <li key={t.id}>
                    <button type="button" className={link} onClick={() => scrollToId('help')}>
                      {t.title.replace('How should I care for brass items?', 'Care & FAQs')}
                    </button>
                  </li>
              )}
              <li>
                <button type="button" className={link} onClick={() => scrollToId('contact')}>
                  Contact us
                </button>
              </li>
            </ul>
          </nav>
          <nav aria-label="Social">
            <p className="text-xs tracking-[0.2em] text-gold">FOLLOW</p>
            <ul className="mt-4 space-y-2.5">
              {socialLinks.map((s) =>
              <li key={s.label}>
                  <a href={s.href} className={link}>
                    {s.label}
                  </a>
                </li>
              )}
            </ul>
          </nav>
        </div>

        <div className="flex flex-col gap-2 border-t border-ivory/10 pt-6 text-xs text-ivory/50 sm:flex-row sm:justify-between">
          <p>© {new Date().getFullYear()} Puskara Divinity Store</p>
          <p>Demo storefront — no orders, payments, or personal data are processed.</p>
        </div>
      </div>
    </footer>);

}