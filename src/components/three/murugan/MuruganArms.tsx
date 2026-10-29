import React, { useMemo } from 'react';
import * as THREE from 'three';
import { Limb, type LimbRing } from '../Limb';
import { Vel } from './Vel';
import { capsule, type Vec3 } from '../../../utils/geometry';
import { getMaterials } from '../../../utils/materials';
import { registerAnchor } from '../../../utils/cinematicState';

const LEFT = {
  shoulder: [0.4, 2.3, 0] as Vec3,
  elbow: [0.52, 1.96, 0.07] as Vec3,
  wrist: [0.55, 1.75, 0.22] as Vec3,
  hand: [0.555, 1.714, 0.246] as Vec3
};
const RIGHT = {
  shoulder: [-0.4, 2.3, 0] as Vec3,
  elbow: [-0.53, 1.98, 0.06] as Vec3,
  wrist: [-0.46, 2.15, 0.25] as Vec3
};
const ARMLETS: LimbRing[] = [
{ t: 0.27, tube: 0.013, gem: true },
{ t: 0.35, tube: 0.007 }];

const BRACELETS: LimbRing[] = [
{ t: 0.8, tube: 0.009 },
{ t: 0.9, tube: 0.011, gem: true }];


const FINGERS = [
{ x: 0.029, length: 0.068, radius: 0.0105, spread: -0.07 }, // index (thumb side)
{ x: 0.01, length: 0.076, radius: 0.011, spread: -0.02 },
{ x: -0.01, length: 0.07, radius: 0.0105, spread: 0.03 },
{ x: -0.028, length: 0.056, radius: 0.009, spread: 0.08 } // little finger
];

/** Both arms with jewellery; the left hand grips the Vel through a stable parent group. */
export function MuruganArms({ reducedMotion }: {reducedMotion: boolean;}) {
  const m = getMaterials();
  const sphere = useMemo(() => new THREE.SphereGeometry(1, 24, 18), []);

  return (
    <group name="Arms">
      <group name="LeftArm">
        <mesh geometry={sphere} material={m.skin} position={LEFT.shoulder} scale={0.105} />
        <Limb from={LEFT.shoulder} to={LEFT.elbow} r1={0.085} r2={0.062} bulge={0.014} material={m.skin} rings={ARMLETS} />
        <mesh geometry={sphere} material={m.skin} position={LEFT.elbow} scale={0.06} />
        <Limb from={LEFT.elbow} to={LEFT.wrist} r1={0.06} r2={0.041} bulge={0.008} material={m.skin} rings={BRACELETS} />
        <group name="LeftHand" position={LEFT.hand}>
          <GripHand sphere={sphere} />
          <group ref={registerAnchor('velHand')} />
          <Vel reducedMotion={reducedMotion} />
        </group>
      </group>

      <group name="RightArm">
        <mesh geometry={sphere} material={m.skin} position={RIGHT.shoulder} scale={0.105} />
        <Limb from={RIGHT.shoulder} to={RIGHT.elbow} r1={0.085} r2={0.062} bulge={0.014} material={m.skin} rings={ARMLETS} />
        <mesh geometry={sphere} material={m.skin} position={RIGHT.elbow} scale={0.06} />
        <Limb from={RIGHT.elbow} to={RIGHT.wrist} r1={0.06} r2={0.041} bulge={0.008} material={m.skin} rings={BRACELETS} />
        <group name="RightHand" position={RIGHT.wrist} rotation={[-0.1, 0, -0.08]}>
          <BlessingHand sphere={sphere} />
        </group>
      </group>
    </group>);

}

/** Abhaya mudra: palm forward, fingers raised, thumb toward the body. */
function BlessingHand({ sphere }: {sphere: THREE.BufferGeometry;}) {
  const m = getMaterials();
  const disc = useMemo(() => new THREE.CircleGeometry(0.02, 24), []);
  return (
    <group name="BlessingHand">
      <mesh geometry={sphere} material={m.skin} position={[0, 0.05, 0]} scale={[0.047, 0.056, 0.02]} />
      {FINGERS.map((f) =>
      <Finger key={f.x} base={[f.x, 0.098, 0]} length={f.length} radius={f.radius} spread={f.spread} curl={-0.05} />
      )}
      <Finger base={[0.04, 0.03, 0.006]} length={0.055} radius={0.012} spread={-0.75} curl={0.2} />
      <mesh geometry={disc} material={m.kumkum} position={[0, 0.05, 0.0205]} />
    </group>);

}

/** Fist wrapped around the vertical shaft. */
function GripHand({ sphere }: {sphere: THREE.BufferGeometry;}) {
  const m = getMaterials();
  const knuckle = useMemo(() => new THREE.TorusGeometry(0.033, 0.0115, 10, 28, Math.PI * 1.5), []);
  return (
    <group name="GripHand">
      <mesh geometry={sphere} material={m.skin} position={[0.03, 0, -0.016]} scale={[0.03, 0.05, 0.042]} />
      {[0.03, 0.01, -0.01, -0.029].map((y, i) =>
      <mesh key={y} geometry={knuckle} material={m.skin} position={[0, y, 0]} rotation={[Math.PI / 2, 0, 0]} scale={i === 3 ? 0.92 : 1} />
      )}
      <mesh geometry={capsule(0.012, 0.04)} material={m.skin} position={[0.004, 0.05, 0.03]} rotation={[0, 0.3, Math.PI / 2]} />
    </group>);

}

type FingerProps = {base: Vec3;length: number;radius: number;spread: number;curl: number;};

function Finger({ base, length, radius, spread, curl }: FingerProps) {
  const m = getMaterials();
  const l1 = length * 0.55;
  const l2 = length * 0.45;
  return (
    <group position={base} rotation={[curl, 0, spread]}>
      <mesh geometry={capsule(radius, l1)} material={m.skin} position={[0, l1 / 2, 0]} />
      <group position={[0, l1, 0]} rotation={[curl * 1.2, 0, 0]}>
        <mesh geometry={capsule(radius * 0.9, l2)} material={m.skin} position={[0, l2 / 2, 0]} />
      </group>
    </group>);

}