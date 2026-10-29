import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { createVelBladeGeometry, lathe } from '../../../utils/geometry';
import { getMaterials } from '../../../utils/materials';
import { cinematicState, registerAnchor } from '../../../utils/cinematicState';

/** Local space: origin is the centre of the gripping fist; the shaft runs vertically through it. */
const SHAFT_BOTTOM = -1.364; // rests on the pedestal top
const SHAFT_TOP = 1.42;
const SHAFT_LEN = SHAFT_TOP - SHAFT_BOTTOM;
const BLADE_BASE = 1.56;
const BAND_YS = [-1.25, -0.62, 0.32, 0.86, 1.32];

const COLLAR: [number, number][] = [
[0.02, 0], [0.035, 0.02], [0.052, 0.05], [0.046, 0.08], [0.03, 0.1],
[0.042, 0.12], [0.028, 0.14], [0.02, 0.165]];

const FERRULE: [number, number][] = [[0.0001, -0.02], [0.026, -0.01], [0.03, 0.02], [0.022, 0.06]];

export function Vel({ reducedMotion }: {reducedMotion: boolean;}) {
  const m = getMaterials();
  const sweepRef = useRef<THREE.PointLight>(null);
  const g = useMemo(
    () => ({
      shaft: new THREE.CylinderGeometry(0.019, 0.021, SHAFT_LEN, 18),
      band: new THREE.TorusGeometry(0.023, 0.006, 8, 28),
      collar: lathe(COLLAR, 32),
      ferrule: lathe(FERRULE, 24),
      blade: createVelBladeGeometry(),
      gem: new THREE.SphereGeometry(0.016, 16, 12)
    }),
    []
  );

  // Restrained highlight travelling along the blade, only lit during the Vel section.
  useFrame(({ clock }) => {
    const light = sweepRef.current;
    if (!light) return;
    const s = cinematicState.velLight;
    light.intensity = s * 2.2;
    if (s > 0.001 && !reducedMotion) {
      light.position.y = BLADE_BASE + 0.08 + (0.5 + 0.5 * Math.sin(clock.elapsedTime * 1.1)) * 0.38;
    }
  });

  return (
    <group name="Vel">
      <mesh geometry={g.shaft} material={m.gold} position={[0, (SHAFT_TOP + SHAFT_BOTTOM) / 2, 0]} />
      {BAND_YS.map((y) =>
      <mesh key={y} geometry={g.band} material={m.goldPolished} position={[0, y, 0]} rotation={[Math.PI / 2, 0, 0]} />
      )}
      <mesh geometry={g.ferrule} material={m.goldPolished} position={[0, SHAFT_BOTTOM, 0]} />
      <mesh geometry={g.collar} material={m.goldPolished} position={[0, SHAFT_TOP, 0]} />
      <mesh geometry={g.blade} material={m.goldPolished} position={[0, BLADE_BASE, 0]} />
      {[-1, 1].map((s) =>
      <mesh key={s} geometry={g.gem} material={m.ruby} position={[0, BLADE_BASE + 0.07, s * 0.016]} scale={[0.9, 1.3, 0.45]} />
      )}
      <group ref={registerAnchor('velBlade')} position={[0, BLADE_BASE + 0.24, 0]} />
      <pointLight ref={sweepRef} position={[0.12, BLADE_BASE + 0.2, 0.2]} distance={0.9} decay={2} color="#ffdf9a" intensity={0} />
    </group>);

}