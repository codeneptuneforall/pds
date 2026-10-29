import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { peacockPath } from '../../data/sceneWaypoints';
import { cinematicState } from '../../utils/cinematicState';
import { lerp, smoothstep } from '../../utils/geometry';

type PeacockRigProps = {reducedMotion: boolean;children: React.ReactNode;};

/** PeacockRoot: walks the peacock in from below-left along a curve, driven by scroll progress. */
export function PeacockRig({ reducedMotion, children }: PeacockRigProps) {
  const ref = useRef<THREE.Group>(null);
  const v = useMemo(
    () => ({
      a: new THREE.Vector3(...peacockPath.start),
      b: new THREE.Vector3(...peacockPath.control),
      c: new THREE.Vector3(...peacockPath.end),
      p: new THREE.Vector3()
    }),
    []
  );

  useFrame(({ clock }) => {
    const group = ref.current;
    if (!group) return;
    const t = cinematicState.peacock;
    group.visible = t > 0.001;
    if (!group.visible) return;
    const it = 1 - t;
    v.p.set(0, 0, 0).addScaledVector(v.a, it * it).addScaledVector(v.b, 2 * it * t).addScaledVector(v.c, t * t);
    if (!reducedMotion && t < 0.98) v.p.y += Math.abs(Math.sin(clock.elapsedTime * 6.5)) * 0.035 * (1 - t);
    group.position.copy(v.p);
    group.rotation.y = lerp(peacockPath.startRotationY, peacockPath.endRotationY, smoothstep(0.45, 1, t));
  });

  return (
    <group ref={ref} name="PeacockRoot" scale={peacockPath.scale} visible={false}>
      {children}
    </group>);

}