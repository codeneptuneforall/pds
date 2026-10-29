import type { BackgroundPalette, LightPreset, SectionId } from '../types/cinematic';

/** Peacock entrance: quadratic path from below-left into place beside Lord Murugan. */
export const peacockPath = {
  start: [-3.9, -1.7, 1.4] as [number, number, number],
  control: [-2.7, -0.15, 0.9] as [number, number, number],
  end: [-1.0, 0, -0.55] as [number, number, number],
  startRotationY: 1.35,
  endRotationY: 0.35,
  scale: 1.25
};

export const lightPresets: Record<SectionId, LightPreset> = {
  hero: { key: 1, fill: 0.8, rim: 1, teal: 0 },
  face: { key: 1.1, fill: 1.15, rim: 0.6, teal: 0 },
  jewels: { key: 1.2, fill: 1, rim: 0.7, teal: 0 },
  vel: { key: 0.8, fill: 0.5, rim: 1.35, teal: 0 },
  crown: { key: 1, fill: 0.7, rim: 1.2, teal: 0 },
  peacock: { key: 1, fill: 0.85, rim: 1.1, teal: 1 }
};

/** Colour treatment of the ambient background per section (values are tweened, the loop never restarts). */
export const backgroundPalettes: Record<SectionId, BackgroundPalette> = {
  hero: { base: 'rgb(26, 21, 18)', glow: 'rgba(213, 173, 87, 0.32)', motif: 'rgba(213, 173, 87, 0.16)', ray: 'rgba(255, 214, 140, 0.08)', speck: 'rgba(232, 196, 120, 0.85)' },
  face: { base: 'rgb(239, 227, 205)', glow: 'rgba(255, 247, 228, 0.95)', motif: 'rgba(84, 29, 36, 0.09)', ray: 'rgba(255, 255, 255, 0.24)', speck: 'rgba(169, 131, 47, 0.55)' },
  jewels: { base: 'rgb(230, 210, 168)', glow: 'rgba(255, 238, 196, 0.9)', motif: 'rgba(122, 92, 28, 0.12)', ray: 'rgba(255, 249, 228, 0.26)', speck: 'rgba(150, 112, 36, 0.55)' },
  vel: { base: 'rgb(28, 23, 20)', glow: 'rgba(213, 173, 87, 0.24)', motif: 'rgba(213, 173, 87, 0.12)', ray: 'rgba(255, 214, 140, 0.07)', speck: 'rgba(232, 196, 120, 0.8)' },
  crown: { base: 'rgb(58, 21, 25)', glow: 'rgba(213, 173, 87, 0.34)', motif: 'rgba(213, 173, 87, 0.15)', ray: 'rgba(255, 200, 120, 0.08)', speck: 'rgba(232, 196, 120, 0.85)' },
  peacock: { base: 'rgb(14, 43, 41)', glow: 'rgba(38, 122, 85, 0.45)', motif: 'rgba(213, 173, 87, 0.14)', ray: 'rgba(120, 220, 200, 0.07)', speck: 'rgba(170, 230, 205, 0.7)' }
};