import React from 'react';

type Speck = {left: string;size: number;dur: number;delay: number;dx: string;o: number;restTop: string;};

const SPECKS: Speck[] = Array.from({ length: 26 }, (_, i) => {
  const r = (n: number) => {
    const s = Math.sin((i + 1) * 12.9898 + n * 78.233) * 43758.5453;
    return s - Math.floor(s);
  };
  return {
    left: `${(r(1) * 100).toFixed(2)}%`,
    size: 1.5 + r(2) * 2.5,
    dur: 24 + r(3) * 22,
    delay: -r(4) * 46,
    dx: `${((r(5) - 0.5) * 14).toFixed(2)}vw`,
    o: 0.25 + r(6) * 0.5,
    restTop: `${(r(7) * 100).toFixed(2)}%`
  };
});

const PETALS = Array.from({ length: 16 }, (_, i) => i / 16 * 360);

/**
 * Decorative, continuously looping atmosphere. Pure CSS animation — it never reads
 * scroll progress, never restarts, and never receives pointer events. Only its colour
 * variables are eased between sections by the cinematic timeline.
 */
export function AnimatedBackground() {
  return (
    <div className="ambient" aria-hidden="true">
      <div className="ambient-glow" />
      <div className="ambient-rays" />
      <svg className="ambient-mandala" viewBox="-100 -100 200 200" fill="none" stroke="currentColor" strokeWidth="0.35">
        <circle r="96" />
        <circle r="84" />
        <circle r="60" strokeDasharray="1.5 3" />
        <circle r="34" />
        {PETALS.map((deg) =>
        <path key={deg} transform={`rotate(${deg})`} d="M0 -34 C 12 -48, 12 -70, 0 -84 C -12 -70, -12 -48, 0 -34 Z" />
        )}
        {PETALS.map((deg) =>
        <path key={`o-${deg}`} transform={`rotate(${deg + 11.25})`} d="M0 -84 C 6 -88, 6 -92, 0 -96 C -6 -92, -6 -88, 0 -84 Z" />
        )}
      </svg>
      <div className="ambient-mist" />
      <div className="ambient-sweep" />
      {SPECKS.map((s, i) =>
      <span
        key={i}
        className={`ambient-speck ${i >= 12 ? 'hidden md:block' : ''}`}
        style={
        {
          left: s.left,
          width: s.size,
          height: s.size,
          '--dur': `${s.dur}s`,
          '--delay': `${s.delay}s`,
          '--dx': s.dx,
          '--o': s.o,
          '--rest-top': s.restTop
        } as React.CSSProperties
        } />

      )}
    </div>);

}