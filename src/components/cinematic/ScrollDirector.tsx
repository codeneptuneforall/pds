import React, { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ExperienceCanvas } from '../three/ExperienceCanvas';
import { ErrorBoundary } from '../ErrorBoundary';
import { HeroLayer } from './HeroLayer';
import { SectionLayer } from './SectionLayer';
import { LoadingScreen } from './LoadingScreen';
import { SceneFallback } from './SceneFallback';
import { cinematicSections } from '../../data/storyboard';
import { buildScrollTimeline } from '../../utils/scrollTimeline';
import { cinematicState } from '../../utils/cinematicState';
import { scrollToId } from '../../utils/store';
import { useIsCompact, useReducedMotion, useWebGLSupport } from '../../hooks/useMediaQuery';
import { useStore } from '../../contexts/StoreContext';
import type { CinematicAction } from '../../types/cinematic';

gsap.registerPlugin(ScrollTrigger);

/**
 * Pins the cinematic stage (one persistent canvas + HTML text layers) and
 * drives it with a single scrubbed master timeline.
 */
export function ScrollDirector() {
  const pinRef = useRef<HTMLElement>(null);
  const reducedMotion = useReducedMotion();
  const compact = useIsCompact();
  const webgl = useWebGLSupport();
  const { setActiveFilter } = useStore();
  const [sceneReady, setSceneReady] = useState(false);
  const [sceneFailed, setSceneFailed] = useState(false);
  const ready = sceneReady || sceneFailed || !webgl;

  const handleReady = useCallback(() => setSceneReady(true), []);
  const handleError = useCallback(() => setSceneFailed(true), []);

  // Never trap visitors behind the loader.
  useEffect(() => {
    const t = window.setTimeout(() => setSceneReady(true), 12000);
    return () => window.clearTimeout(t);
  }, []);

  // Master scroll timeline + pin.
  useLayoutEffect(() => {
    const root = pinRef.current;
    if (!root) return;
    const ctx = gsap.context(() => {
      const tl = buildScrollTimeline(root, reducedMotion);
      ScrollTrigger.create({
        trigger: root,
        start: 'top top',
        end: () => `+=${Math.round(window.innerHeight * 6.5)}`,
        pin: true,
        scrub: reducedMotion ? true : 0.9,
        animation: tl,
        invalidateOnRefresh: true,
        anticipatePin: 1
      });
    }, root);
    return () => ctx.revert();
  }, [reducedMotion]);

  // Hero text starts hidden until the scene has revealed.
  useLayoutEffect(() => {
    const items = pinRef.current?.querySelectorAll('[data-hero-item]');
    if (items?.length) gsap.set(items, { autoAlpha: 0, y: 18 });
  }, []);

  // Opening: reveal from darkness, settle the character right, stagger the hero text in.
  useEffect(() => {
    if (!ready) return;
    const items = pinRef.current?.querySelectorAll('[data-hero-item]');
    ScrollTrigger.refresh();
    if (reducedMotion) {
      cinematicState.intro = 1;
      cinematicState.reveal = 1;
      if (items?.length) gsap.set(items, { autoAlpha: 1, y: 0 });
      return;
    }
    const tl = gsap.timeline();
    tl.to(cinematicState, { reveal: 1, duration: 2.4, ease: 'power2.out' }, 0.1);
    tl.to(cinematicState, { intro: 1, duration: 2.6, ease: 'power3.inOut' }, 0.5);
    if (items?.length) tl.to(items, { autoAlpha: 1, y: 0, duration: 0.3, ease: 'power2.out', stagger: 0.09 }, 1.6);
    return () => {
      tl.progress(1);
      tl.kill();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ready]);

  const runAction = useCallback(
    (action: CinematicAction) => {
      if (action.type === 'filter') {
        setActiveFilter(action.collectionId);
        scrollToId('shop');
      } else {
        scrollToId(action.target);
      }
    },
    [setActiveFilter]
  );

  return (
    <>
      <section ref={pinRef} id="top" aria-label="Lord Murugan — a cinematic introduction" className="relative h-[100svh] w-full overflow-hidden">
        {webgl && !sceneFailed ?
        <ErrorBoundary onError={handleError} fallback={<SceneFallback />}>
            <ExperienceCanvas reducedMotion={reducedMotion} compact={compact} onReady={handleReady} />
          </ErrorBoundary> :

        <SceneFallback />
        }
        <div className="pointer-events-none absolute inset-0 z-10">
          <HeroLayer />
          {cinematicSections.map((section) =>
          <SectionLayer key={section.id} section={section} onAction={runAction} />
          )}
        </div>
      </section>
      <AnimatePresence>{!ready && <LoadingScreen key="loader" />}</AnimatePresence>
    </>);

}