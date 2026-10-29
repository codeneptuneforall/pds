import React, { useState } from 'react';
import { ChevronDownIcon } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { ContactForm } from './ContactForm';
import { contactPlaceholders, helpTopics } from '../../data/siteContent';

export function SupportSection() {
  const [openId, setOpenId] = useState<string | null>('shipping');

  return (
    <section id="contact" aria-labelledby="contact-title" className="relative bg-ivory py-20 lg:py-28">
      <div className="mx-auto grid max-w-7xl gap-14 px-4 lg:grid-cols-12 lg:px-12">
        <div className="lg:col-span-5">
          <h2 id="contact-title" className="font-display text-4xl font-medium leading-[1.02] text-charcoal sm:text-5xl">
            We’re here to help
          </h2>
          <dl className="mt-8 grid grid-cols-2 gap-x-6 gap-y-5">
            {contactPlaceholders.map((c) =>
            <div key={c.label}>
                <dt className="text-xs text-charcoal/55">{c.label}</dt>
                <dd className="mt-1 text-sm italic text-charcoal/45">{c.value}</dd>
              </div>
            )}
          </dl>
          <div className="mt-10">
            <ContactForm />
          </div>
        </div>

        <div id="help" className="lg:col-span-6 lg:col-start-7">
          <h3 className="font-display text-3xl font-medium text-charcoal">Help & policies</h3>
          <ul className="mt-6 border-t border-charcoal/10">
            {helpTopics.map((topic) => {
              const open = openId === topic.id;
              return (
                <li key={topic.id} id={topic.id} className="border-b border-charcoal/10">
                  <h4>
                    <button
                      type="button"
                      aria-expanded={open}
                      aria-controls={`${topic.id}-panel`}
                      onClick={() => setOpenId(open ? null : topic.id)}
                      className="flex w-full items-center justify-between gap-4 py-5 text-left font-display text-xl text-charcoal transition-colors duration-150 hover:text-maroon focus-visible:outline focus-visible:outline-2 focus-visible:outline-maroon">
                      
                      {topic.title}
                      <ChevronDownIcon className={`h-5 w-5 shrink-0 transition-transform duration-200 ease-smooth ${open ? 'rotate-180' : ''}`} />
                    </button>
                  </h4>
                  <AnimatePresence initial={false}>
                    {open &&
                    <motion.div
                      id={`${topic.id}-panel`}
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.22, ease: [0.23, 1, 0.32, 1] }}
                      className="overflow-hidden">
                      
                        <p className="pb-5 pr-8 text-sm leading-relaxed text-charcoal/70">{topic.body}</p>
                      </motion.div>
                    }
                  </AnimatePresence>
                </li>);

            })}
          </ul>
        </div>
      </div>
    </section>);

}