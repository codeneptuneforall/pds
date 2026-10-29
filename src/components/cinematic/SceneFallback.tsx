import React from 'react';
import { BrandMark } from '../BrandMark';

/** Shown in place of the 3D scene when WebGL is unavailable or fails to start. */
export function SceneFallback() {
  return (
    <div className="absolute inset-0 flex items-start justify-center pt-28 lg:items-center lg:justify-end lg:pr-[10vw] lg:pt-0">
      <div className="pointer-events-auto max-w-xs rounded-2xl border border-gold/30 bg-charcoal/70 p-5 text-ivory backdrop-blur-sm">
        <BrandMark className="h-8 w-8" />
        <p className="mt-3 font-display text-xl">The 3D sanctum couldn't start here.</p>
        <p className="mt-1.5 text-sm text-ivory/70">
          Your browser or device doesn't support WebGL. The story and the entire store still work as usual.
        </p>
      </div>
    </div>);

}