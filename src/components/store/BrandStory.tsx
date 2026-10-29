import React from 'react';
import { brandStory } from '../../data/siteContent';

export function BrandStory() {
  return (
    <section id="story" aria-labelledby="story-title" className="relative bg-maroon py-20 text-ivory lg:py-28">
      <div className="mx-auto grid max-w-7xl gap-12 px-4 lg:grid-cols-12 lg:px-12">
        <h2 id="story-title" className="font-display text-4xl font-medium leading-[1.02] sm:text-5xl lg:col-span-6 lg:text-6xl">
          {brandStory.headline}
        </h2>
        <div className="lg:col-span-5 lg:col-start-8">
          {brandStory.paragraphs.map((p) =>
          <p key={p} className="mb-4 text-base leading-relaxed text-ivory/80 lg:text-lg">
              {p}
            </p>
          )}
          <dl className="mt-8 border-t border-ivory/15">
            {brandStory.principles.map((item) =>
            <div key={item.title} className="grid gap-1 border-b border-ivory/15 py-5 sm:grid-cols-[11rem_1fr] sm:gap-6">
                <dt className="font-display text-xl text-gold">{item.title}</dt>
                <dd className="text-sm leading-relaxed text-ivory/75">{item.text}</dd>
              </div>
            )}
          </dl>
        </div>
      </div>
    </section>);

}