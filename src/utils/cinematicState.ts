import type { Object3D } from 'three';
import type { AnchorName } from '../types/cinematic';
import { lightPresets } from '../data/sceneWaypoints';

/**
 * Plain mutable state shared between the GSAP timeline (writer) and the
 * R3F frame loop (reader). Never stored in React state, so scrolling causes no re-renders.
 */
export type CinematicState = {
  /** Fractional index into cameraWaypoints. */
  cam: number;
  /** Hero intro progress (time-based, on load). */
  intro: number;
  /** Light reveal from darkness (time-based, on load). */
  reveal: number;
  key: number;
  fill: number;
  rim: number;
  teal: number;
  velLight: number;
  peacock: number;
  peacockFan: number;
};

export const cinematicState: CinematicState = {
  cam: 0,
  intro: 0,
  reveal: 0,
  ...lightPresets.hero,
  velLight: 0,
  peacock: 0,
  peacockFan: 0
};

export const sceneAnchors: Partial<Record<AnchorName, Object3D>> = {};

export function registerAnchor(name: AnchorName) {
  return (object: Object3D | null) => {
    if (object) sceneAnchors[name] = object;
  };
}