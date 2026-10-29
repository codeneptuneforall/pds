import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import type { Group } from 'three';
import { Pedestal } from './murugan/Pedestal';
import { MuruganBody } from './murugan/MuruganBody';
import { MuruganJewellery } from './murugan/MuruganJewellery';
import { MuruganArms } from './murugan/MuruganArms';
import { MuruganHead } from './murugan/MuruganHead';
import { MuruganCrown } from './murugan/MuruganCrown';
import { registerAnchor } from '../../utils/cinematicState';

type MuruganCharacterProps = {
  reducedMotion: boolean;
  detail: 'high' | 'low';
};

const HEAD_POSITION: [number, number, number] = [0, 2.86, 0.01];

/**
 * Fully procedural Lord Murugan.
 * Hierarchy: MuruganRoot → Pedestal, Body → (Torso, Ornaments, Arms → LeftHand → Vel, Head → Face, Crown).
 * Named anchors inside the hierarchy give the camera exact, geometry-derived targets.
 */
export function MuruganCharacter({ reducedMotion, detail }: MuruganCharacterProps) {
  const headRef = useRef<Group>(null);

  // A gentle, living head sway. Jewellery on the head moves with it because it is parented to it.
  useFrame(({ clock }) => {
    const head = headRef.current;
    if (!head || reducedMotion) return;
    const t = clock.elapsedTime;
    head.rotation.z = Math.sin(t * 0.5) * 0.012;
    head.rotation.x = 0.04 + Math.sin(t * 0.35) * 0.01;
  });

  return (
    <group name="MuruganRoot">
      <Pedestal />
      <group name="Body">
        <MuruganBody />
        <MuruganJewellery />
        <MuruganArms reducedMotion={reducedMotion} />
        <group name="Head" ref={headRef} position={HEAD_POSITION} rotation={[0.04, 0, 0]}>
          <MuruganHead detail={detail} />
          <MuruganCrown />
          <group ref={registerAnchor('face')} position={[0, 0, 0.2]} />
          <group ref={registerAnchor('crown')} position={[0, 0.48, 0]} />
        </group>
        <group ref={registerAnchor('body')} position={[0, 1.9, 0]} />
        <group ref={registerAnchor('necklace')} position={[0, 2.22, 0.2]} />
        <group ref={registerAnchor('shoulder')} position={[0.22, 2.45, 0.1]} />
      </group>
    </group>);

}