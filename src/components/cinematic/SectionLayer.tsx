import React from 'react';
import { ArrowRightIcon } from 'lucide-react';
import type { CinematicAction, CinematicSection } from '../../types/cinematic';

type SectionLayerProps = {
  section: CinematicSection;
  onAction: (action: CinematicAction) => void;
};

const LAYOUT: Record<CinematicSection['layout'], string> = {
  left: 'lg:justify-start',
  right: 'lg:justify-end',
  split: 'lg:justify-between'
};

/** Text for one cinematic section. Blocks are revealed/hidden by the scroll timeline. */
export function SectionLayer({ section, onAction }: SectionLayerProps) {
  const dark = section.tone === 'dark';
  const split = section.layout === 'split';

  return (
    <div data-section={section.id} className="absolute inset-0">
      <div className="flex h-full flex-col justify-end lg:justify-center">
        <div className={`mx-auto flex w-full max-w-7xl flex-col gap-3 px-4 pb-6 lg:flex-row lg:items-center lg:px-12 lg:pb-0 ${LAYOUT[section.layout]}`}>
          {section.blocks.map((block, idx) =>
          <div
            key={block.headline}
            data-block={split ? idx === 0 ? 'left' : 'right' : ''}
            className={`pointer-events-auto rounded-2xl p-5 backdrop-blur-sm lg:rounded-none lg:bg-transparent lg:p-0 lg:backdrop-blur-none ${
            dark ? 'bg-charcoal/75' : 'bg-ivory/85'} ${
            split ? 'lg:max-w-[18rem] xl:max-w-[20.5rem]' : 'lg:max-w-md xl:max-w-lg'} ${split && idx === 1 ? 'lg:text-right' : ''}`}>
            
              <p className={`text-xs font-medium tracking-[0.26em] ${dark ? 'text-gold' : 'text-maroon'}`}>{block.eyebrow}</p>
              <h2
              className={`mt-3 font-display font-medium leading-[1.02] ${dark ? 'text-ivory' : 'text-charcoal'} ${
              split ? 'text-2xl sm:text-3xl lg:text-4xl' : 'text-3xl sm:text-4xl lg:text-5xl xl:text-6xl'}`
              }>
              
                {block.headline}
              </h2>
              <p
              className={`mt-3 text-[15px] leading-relaxed lg:mt-4 lg:text-base ${dark ? 'text-ivory/80' : 'text-charcoal/75'} ${
              split && idx === 1 ? 'hidden lg:block' : ''}`
              }>
              
                {block.body}
              </p>
              {block.cta &&
            <button
              type="button"
              onClick={() => block.cta && onAction(block.cta.action)}
              className={`mt-5 inline-flex items-center gap-2 whitespace-nowrap rounded-full px-5 py-3 text-sm font-semibold transition-colors duration-150 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 lg:mt-7 ${
              dark ?
              'bg-gold text-charcoal hover:bg-gold-light focus-visible:outline-gold' :
              'bg-maroon text-ivory hover:bg-maroon-light focus-visible:outline-maroon'}`
              }>
              
                  {block.cta.label}
                  <ArrowRightIcon className="h-4 w-4" />
                </button>
            }
            </div>
          )}
        </div>
      </div>
    </div>);

}