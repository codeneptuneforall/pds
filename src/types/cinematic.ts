import type { CollectionId } from './store';

export type SectionId = 'hero' | 'face' | 'jewels' | 'vel' | 'crown' | 'peacock';

export type AnchorName = 'body' | 'face' | 'necklace' | 'velHand' | 'velBlade' | 'shoulder' | 'crown';

export type CameraWaypoint = {
  id: string;
  /** Named anchor on the character, or a fixed world point. */
  anchor: AnchorName | [number, number, number];
  offset: [number, number, number];
  /** Spherical camera offset around the target. Azimuth 0 = facing the character. */
  distance: number;
  azimuth: number;
  elevation: number;
  fov: number;
  /** Where the subject sits on screen (fraction of width/height, + = right / up). */
  screenX: number;
  screenY: number;
  /** Extra distance multiplier and vertical framing for portrait screens. */
  portraitDistance: number;
  portraitScreenY: number;
};

export type LightPreset = {key: number;fill: number;rim: number;teal: number;};

export type BackgroundPalette = {base: string;glow: string;motif: string;ray: string;speck: string;};

export type CinematicAction = {type: 'scroll';target: string;} | {type: 'filter';collectionId: CollectionId;};

export type CinematicBlock = {
  eyebrow: string;
  headline: string;
  body: string;
  cta?: {label: string;action: CinematicAction;};
};

export type CinematicSection = {
  id: Exclude<SectionId, 'hero'>;
  tone: 'light' | 'dark';
  layout: 'left' | 'right' | 'split';
  blocks: CinematicBlock[];
};