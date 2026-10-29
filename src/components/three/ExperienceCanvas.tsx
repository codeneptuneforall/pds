import React, { useEffect, useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { CameraRig } from './CameraRig';
import { LightingRig } from './LightingRig';
import { MuruganCharacter } from './MuruganCharacter';
import { PeacockRig } from './PeacockRig';
import { Peacock } from './Peacock';

type ExperienceCanvasProps = {
  reducedMotion: boolean;
  compact: boolean;
  onReady: () => void;
};

/** The single persistent canvas for all six cinematic sections. */
export function ExperienceCanvas({ reducedMotion, compact, onReady }: ExperienceCanvasProps) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(true);

  // Pause rendering when the pinned scene has scrolled out of view.
  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const io = new IntersectionObserver(([entry]) => setActive(entry.isIntersecting), { threshold: 0 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={wrapRef} className="absolute inset-0" aria-hidden="true">
      <Canvas
        frameloop={active ? 'always' : 'never'}
        dpr={[1, compact ? 1.5 : 1.75]}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
        camera={{ fov: 34, near: 0.05, far: 80, position: [3, 2.2, 9] }}
        style={{ pointerEvents: 'none' }}
        onCreated={({ gl }) => {
          gl.toneMapping = THREE.ACESFilmicToneMapping;
          gl.toneMappingExposure = 1.05;
          gl.setClearColor(0x000000, 0);
        }}>
        
        <LightingRig />
        <CameraRig reducedMotion={reducedMotion} />
        <MuruganCharacter reducedMotion={reducedMotion} detail={compact ? 'low' : 'high'} />
        <PeacockRig reducedMotion={reducedMotion}>
          <Peacock />
        </PeacockRig>
        <ReadySignal onReady={onReady} />
      </Canvas>
    </div>);

}

function ReadySignal({ onReady }: {onReady: () => void;}) {
  const frames = useRef(0);
  const done = useRef(false);
  useFrame(() => {
    if (done.current) return;
    frames.current += 1;
    if (frames.current > 2) {
      done.current = true;
      onReady();
    }
  });
  return null;
}