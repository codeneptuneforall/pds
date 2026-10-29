import React, { useMemo } from 'react';
import * as THREE from 'three';
import { Limb } from '../Limb';
import {
  TORSO_DEPTH,
  createDhotiGeometry,
  createPleatGeometry,
  createTorsoGeometry,
  torsoRadius,
  type Vec3 } from
'../../../utils/geometry';
import { getMaterials } from '../../../utils/materials';

const LEGS = [1, -1].map((s) => ({
  s,
  hip: [s * 0.14, 1.5, 0] as Vec3,
  knee: [s * 0.15, 0.98, 0.04] as Vec3,
  ankle: [s * 0.16, 0.47, 0] as Vec3
}));
const TOES = [
{ x: 0.03, r: 0.014 },
{ x: 0.008, r: 0.012 },
{ x: -0.012, r: 0.011 },
{ x: -0.03, r: 0.01 },
{ x: -0.045, r: 0.009 }];


/** Torso, neck, legs, feet, and the layered silk dhoti. */
export function MuruganBody() {
  const m = getMaterials();
  const g = useMemo(
    () => ({
      torso: createTorsoGeometry(),
      neck: new THREE.CylinderGeometry(0.08, 0.095, 0.3, 28),
      dhoti: createDhotiGeometry(),
      pleats: createPleatGeometry(),
      sphere: new THREE.SphereGeometry(1, 24, 18)
    }),
    []
  );
  const navelZ = TORSO_DEPTH * torsoRadius(1.9) - 0.003;

  return (
    <group name="Torso">
      <mesh geometry={g.torso} material={m.skin} scale={[1, 1, TORSO_DEPTH]} />
      <mesh geometry={g.neck} material={m.skin} position={[0, 2.56, 0]} />
      <mesh geometry={g.sphere} material={m.skinShadow} position={[0, 1.9, navelZ]} scale={[0.011, 0.015, 0.006]} />

      {LEGS.map((leg) =>
      <group key={leg.s} name={leg.s > 0 ? 'LeftLeg' : 'RightLeg'}>
          <Limb from={leg.hip} to={leg.knee} r1={0.11} r2={0.075} material={m.skin} />
          <mesh geometry={g.sphere} material={m.skin} position={leg.knee} scale={0.072} />
          <Limb from={leg.knee} to={leg.ankle} r1={0.07} r2={0.046} bulge={0.014} material={m.skin} />
          <group position={[leg.s * 0.165, 0.392, 0.07]} rotation={[0, leg.s * 0.12, 0]}>
            <mesh geometry={g.sphere} material={m.skin} scale={[0.058, 0.036, 0.12]} />
            {TOES.map((t) =>
          <mesh key={t.x} geometry={g.sphere} material={m.skin} position={[t.x * leg.s, -0.012, 0.105 - Math.abs(t.x) * 0.5]} scale={t.r} />
          )}
          </group>
        </group>
      )}

      <mesh geometry={g.dhoti} material={m.silk} />
      <mesh geometry={g.pleats} material={m.silk} />
    </group>);

}