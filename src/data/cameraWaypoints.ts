import type { AnchorName, CameraWaypoint } from '../types/cinematic';

/**
 * Camera journey through the single persistent character.
 * Targets are named anchors placed inside the character hierarchy (see MuruganCharacter),
 * so framing follows the real generated geometry rather than guessed coordinates.
 * Index = value of cinematicState.cam.
 */
export const cameraWaypoints: CameraWaypoint[] = [
// 0 — Divine arrival: three-quarter full body, subject on the right
{ id: 'hero', anchor: 'body', offset: [0, 0.05, 0], distance: 7.0, azimuth: 0.38, elevation: 0.04, fov: 34, screenX: 0.2, screenY: 0, portraitDistance: 1.75, portraitScreenY: 0.13 },
// 1 — Divine gaze: face framed on the left
{ id: 'face', anchor: 'face', offset: [0, 0.03, -0.12], distance: 1.5, azimuth: 0.42, elevation: 0.06, fov: 30, screenX: -0.21, screenY: 0, portraitDistance: 1.4, portraitScreenY: 0.17 },
// 2 — Craftsmanship: necklaces centred, looking slightly down to reveal layers
{ id: 'jewels', anchor: 'necklace', offset: [0, -0.02, 0], distance: 1.25, azimuth: 0.12, elevation: 0.28, fov: 32, screenX: 0, screenY: 0, portraitDistance: 1.55, portraitScreenY: 0.17 },
// 3 — The hand gripping the Vel
{ id: 'velHand', anchor: 'velHand', offset: [0, 0.05, 0], distance: 1.0, azimuth: 0.95, elevation: 0.02, fov: 32, screenX: 0.05, screenY: 0, portraitDistance: 1.45, portraitScreenY: 0.15 },
// 4 — Along the shaft to the blade
{ id: 'velBlade', anchor: 'velBlade', offset: [0, 0, 0], distance: 1.05, azimuth: 0.5, elevation: -0.08, fov: 30, screenX: 0.05, screenY: 0, portraitDistance: 1.55, portraitScreenY: 0.15 },
// 5 — Ascending past the shoulder toward the face
{ id: 'ascend', anchor: 'shoulder', offset: [0, 0, 0], distance: 1.7, azimuth: 0.55, elevation: 0.12, fov: 32, screenX: 0.1, screenY: 0, portraitDistance: 1.4, portraitScreenY: 0.13 },
// 6 — Crown close-up
{ id: 'crown', anchor: 'crown', offset: [0, -0.02, 0], distance: 1.4, azimuth: 0.48, elevation: 0.2, fov: 30, screenX: 0.2, screenY: 0, portraitDistance: 1.45, portraitScreenY: 0.17 },
// 7 — Pull back to full body
{ id: 'fullBody', anchor: 'body', offset: [0, 0.05, 0], distance: 6.4, azimuth: 0.22, elevation: 0.05, fov: 34, screenX: 0.16, screenY: 0, portraitDistance: 1.75, portraitScreenY: 0.13 },
// 8 — Wide composition with the peacock
{ id: 'wide', anchor: [-0.45, 1.55, -0.25], offset: [0, 0, 0], distance: 7.7, azimuth: 0.22, elevation: 0.08, fov: 34, screenX: 0.18, screenY: 0, portraitDistance: 1.8, portraitScreenY: 0.13 }];


/** Used only for the first frame before anchors have registered. */
export const anchorFallbacks: Record<AnchorName, [number, number, number]> = {
  body: [0, 1.9, 0],
  face: [0, 2.86, 0.2],
  necklace: [0, 2.22, 0.2],
  velHand: [0.555, 1.714, 0.246],
  velBlade: [0.555, 3.514, 0.246],
  shoulder: [0.22, 2.45, 0.1],
  crown: [0, 3.34, 0]
};

/** Hero intro: the camera starts further away and centred, then settles. */
export const heroIntro = { startDistance: 9.6 };