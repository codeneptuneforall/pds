import React from 'react';
import { motion } from 'framer-motion';
import { BrandMark } from '../BrandMark';

export function LoadingScreen() {
  return (
    <motion.div
      role="status"
      aria-live="polite"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25, ease: [0.23, 1, 0.32, 1] }}
      className="fixed inset-0 z-[70] flex flex-col items-center justify-center bg-charcoal text-ivory">
      
      <BrandMark className="h-12 w-12" />
      <p className="mt-6 font-display text-3xl">Puskara Divinity Store</p>
      <p className="mt-2 text-sm text-ivory/60">Preparing the sanctum…</p>
      <div className="mt-8 h-px w-40 overflow-hidden bg-ivory/15">
        <div className="loader-line h-full w-1/3 bg-gold" />
      </div>
    </motion.div>);

}