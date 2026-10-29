import { gsap } from 'gsap';
import { cinematicState } from './cinematicState';
import { backgroundPalettes, lightPresets } from '../data/sceneWaypoints';
import type { SectionId } from '../types/cinematic';

/**
 * Builds the single reversible master timeline. It is scrubbed by ScrollTrigger,
 * so every value here is a pure function of scroll progress — scrolling back reverses it.
 * Time units are arbitrary; ScrollTrigger maps the whole timeline to the pinned scroll distance.
 */
export function buildScrollTimeline(root: HTMLElement, reducedMotion: boolean) {
  const q = gsap.utils.selector(root);
  const s = cinematicState;
  const bg = document.documentElement;
  const shift = reducedMotion ? 0 : 28;
  const tl = gsap.timeline({ defaults: { ease: 'none' } });

  gsap.set(q('[data-section]:not([data-section="hero"]) [data-block]'), { autoAlpha: 0, y: shift });

  const show = (selector: string, at: number) =>
  tl.to(q(selector), { autoAlpha: 1, y: 0, duration: 0.35, ease: 'power2.out', stagger: 0.06 }, at);
  const hide = (selector: string, at: number) =>
  tl.to(q(selector), { autoAlpha: 0, y: -shift, duration: 0.3, ease: 'power1.inOut', stagger: 0.04 }, at);
  const cam = (from: number, to: number, at: number, duration: number, ease = 'power2.inOut') =>
  tl.fromTo(s, { cam: from }, { cam: to, duration, ease, immediateRender: false }, at);
  const mood = (id: SectionId, at: number, duration = 0.8) => {
    const p = backgroundPalettes[id];
    const l = lightPresets[id];
    tl.to(bg, { '--bg-base': p.base, '--bg-glow': p.glow, '--bg-motif': p.motif, '--bg-ray': p.ray, '--bg-speck': p.speck, duration }, at);
    tl.to(s, { key: l.key, fill: l.fill, rim: l.rim, teal: l.teal, duration }, at);
  };

  // 1 → 2: hero exits, camera travels to the face
  hide('[data-section="hero"] [data-block]', 0.5);
  cam(0, 1, 0.5, 1.1);
  mood('face', 0.6);
  show('[data-section="face"] [data-block]', 1.35);

  // 2 → 3: down the neck to the necklaces
  hide('[data-section="face"] [data-block]', 2.05);
  cam(1, 2, 2.0, 1.0);
  mood('jewels', 2.1);
  show('[data-section="jewels"] [data-block="left"]', 2.75);
  show('[data-section="jewels"] [data-block="right"]', 2.9);

  // 3 → 4: to the hand, then along the shaft to the blade
  hide('[data-section="jewels"] [data-block="left"]', 3.5);
  hide('[data-section="jewels"] [data-block="right"]', 3.56);
  cam(2, 3, 3.5, 0.8, 'power1.in');
  cam(3, 4, 4.3, 0.75, 'power1.out');
  mood('vel', 3.6);
  tl.to(s, { velLight: 1, duration: 0.5 }, 4.2);
  show('[data-section="vel"] [data-block="left"]', 4.6);
  show('[data-section="vel"] [data-block="right"]', 4.75);

  // 4 → 5: up the arm and shoulder to the crown, brief hold
  hide('[data-section="vel"] [data-block="left"]', 5.35);
  hide('[data-section="vel"] [data-block="right"]', 5.4);
  tl.to(s, { velLight: 0, duration: 0.4 }, 5.4);
  cam(4, 5, 5.35, 0.6, 'power1.in');
  cam(5, 6, 5.95, 0.75, 'power1.out');
  mood('crown', 5.45);
  show('[data-section="crown"] [data-block]', 6.35);

  // 5 → 6: pull back, the peacock arrives and fans its tail
  hide('[data-section="crown"] [data-block]', 7.0);
  cam(6, 7, 7.0, 0.9);
  mood('peacock', 7.1);
  tl.fromTo(s, { peacock: 0 }, { peacock: 1, duration: 1.2, ease: 'power2.out', immediateRender: false }, 7.25);
  tl.fromTo(s, { peacockFan: 0 }, { peacockFan: 1, duration: 0.7, ease: 'power2.inOut', immediateRender: false }, 7.95);
  cam(7, 8, 7.85, 0.85);
  show('[data-section="peacock"] [data-block]', 8.4);

  // hold the final composition before the pin releases
  tl.to({}, { duration: 0.6 }, 8.8);

  return tl;
}