import React from 'react';
import { ArrowDownIcon, ArrowRightIcon } from 'lucide-react';
import { heroCopy } from '../../data/storyboard';
import { scrollToId } from '../../utils/store';

/** Section 1 — Divine Arrival. Outer [data-block] is driven by scroll; inner [data-hero-item]s by the load intro. */
export function HeroLayer() {
  return (
    <div data-section="hero" className="absolute inset-0">
      <div className="flex h-full flex-col justify-end lg:justify-center">
        <div className="mx-auto w-full max-w-7xl px-4 pb-6 lg:px-12 lg:pb-0">
          <div
            data-block
            className="pointer-events-auto max-w-xl rounded-2xl bg-charcoal/70 p-5 backdrop-blur-sm sm:p-6 lg:rounded-none lg:bg-transparent lg:p-0 lg:backdrop-blur-none">
            
            <p data-hero-item className="text-xs font-medium tracking-[0.28em] text-gold">
              {heroCopy.eyebrow}
            </p>
            <h1 data-hero-item className="mt-4 font-display text-[2.5rem] font-medium leading-[0.98] text-ivory sm:text-5xl lg:mt-5 lg:text-7xl xl:text-[5.25rem]">
              {heroCopy.headline}
            </h1>
            <p data-hero-item className="mt-4 max-w-md text-[15px] leading-relaxed text-ivory/80 lg:mt-6 lg:text-lg">
              {heroCopy.body}
            </p>
            <div data-hero-item className="mt-6 flex flex-wrap gap-3 lg:mt-8">
              <button
                type="button"
                onClick={() => scrollToId(heroCopy.primary.target)}
                className="inline-flex items-center gap-2 whitespace-nowrap rounded-full bg-gold px-5 py-3 text-sm font-semibold text-charcoal transition-colors duration-150 hover:bg-gold-light focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold">
                
                {heroCopy.primary.label}
                <ArrowRightIcon className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => scrollToId(heroCopy.secondary.target)}
                className="whitespace-nowrap rounded-full border border-ivory/35 px-5 py-3 text-sm font-medium text-ivory transition-colors duration-150 hover:bg-ivory/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold">
                
                {heroCopy.secondary.label}
              </button>
            </div>
          </div>
        </div>
      </div>
      <div data-block className="absolute inset-x-0 bottom-6 hidden justify-center lg:flex">
        <div data-hero-item className="flex items-center gap-2 text-xs tracking-wide text-ivory/60">
          <ArrowDownIcon className="h-3.5 w-3.5" />
          Scroll to begin the journey
        </div>
      </div>
    </div>);

}