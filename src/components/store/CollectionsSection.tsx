import React from 'react';
import { ArrowRightIcon } from 'lucide-react';
import { ProductImage } from './ProductImage';
import { collections } from '../../data/collections';
import { scrollToId } from '../../utils/store';
import { useStore } from '../../contexts/StoreContext';
import type { CollectionId } from '../../types/store';

const LAYOUT = ['lg:row-span-2', '', '', 'lg:col-span-2'];
const IMAGE = ['aspect-[4/3] lg:aspect-auto lg:flex-1 lg:min-h-[22rem]', 'aspect-[4/3]', 'aspect-[4/3]', 'aspect-[4/3] lg:aspect-auto lg:w-1/2 lg:min-h-[15rem]'];

/** Section 7 — Sacred Collections. Works independently of the 3D scene. */
export function CollectionsSection() {
  const { setActiveFilter } = useStore();

  const browse = (id: CollectionId) => {
    setActiveFilter(id);
    scrollToId('shop');
  };

  return (
    <section id="collections" aria-labelledby="collections-title" className="relative bg-ivory py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 lg:px-12">
        <div className="grid gap-6 lg:grid-cols-12 lg:items-end">
          <h2 id="collections-title" className="font-display text-4xl font-medium leading-[1.02] text-charcoal sm:text-5xl lg:col-span-7 lg:text-6xl">
            Sacred Treasures for Every Home
          </h2>
          <p className="max-w-md text-base leading-relaxed text-charcoal/70 lg:col-span-5 lg:justify-self-end">
            Explore devotional idols, pooja essentials, spiritual accessories, and meaningful gifts.
          </p>
        </div>

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-[1.25fr_1fr_1fr] lg:grid-rows-[auto_auto]">
          {collections.map((c, i) =>
          <button
            key={c.id}
            type="button"
            onClick={() => browse(c.id)}
            className={`group flex flex-col overflow-hidden rounded-3xl bg-parchment text-left transition-colors duration-200 hover:bg-sandstone focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-maroon ${LAYOUT[i]} ${
            i === 3 ? 'lg:flex-row' : ''}`
            }>
            
              <ProductImage
              src={c.image}
              alt={`${c.title} collection`}
              className={`w-full ${IMAGE[i]}`}
              imgClassName="transition-[transform,opacity] duration-300 group-hover:scale-[1.03]" />
            
              <div className={`flex flex-1 flex-col p-6 ${i === 3 ? 'lg:justify-center lg:p-8' : ''}`}>
                <h3 className={`font-display font-semibold leading-tight text-charcoal ${i === 0 ? 'text-3xl' : 'text-2xl'}`}>{c.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-charcoal/70">{c.description}</p>
                <span className="mt-auto inline-flex items-center gap-1.5 pt-5 text-sm font-medium text-maroon">
                  Browse {c.title}
                  <ArrowRightIcon className="h-4 w-4 transition-transform duration-200 ease-smooth group-hover:translate-x-0.5" />
                </span>
              </div>
            </button>
          )}
        </div>
      </div>
    </section>);

}