import React, { useMemo } from 'react';
import * as THREE from 'three';
import { alignBetween, limbGeometry, limbRadiusAt, type Vec3 } from '../../utils/geometry';
import { getMaterials } from '../../utils/materials';

export type LimbRing = {t: number;tube: number;gem?: boolean;};

type LimbProps = {
  from: Vec3;
  to: Vec3;
  r1: number;
  r2: number;
  bulge?: number;
  material: THREE.Material;
  rings?: LimbRing[];
};

const NO_RINGS: LimbRing[] = [];
const gemGeometry = new THREE.SphereGeometry(0.014, 14, 10);

/** A tapered limb segment between two joints, with optional bracelets/armlets locked to it. */
export function Limb({ from, to, r1, r2, bulge = 0, material, rings = NO_RINGS }: LimbProps) {
  const m = getMaterials();
  const data = useMemo(() => {
    const { position, quaternion, length } = alignBetween(from, to);
    const geometry = limbGeometry(length, r1, r2, bulge);
    const ringData = rings.map((r) => {
      const radius = limbRadiusAt(r.t, r1, r2, bulge) + r.tube * 0.55;
      return { ...r, radius, y: r.t * length, geometry: new THREE.TorusGeometry(radius, r.tube, 10, 40) };
    });
    return { position, quaternion, geometry, ringData };
  }, [from, to, r1, r2, bulge, rings]);

  return (
    <group position={data.position} quaternion={data.quaternion}>
      <mesh geometry={data.geometry} material={material} />
      {data.ringData.map((r, i) =>
      <group key={i} position={[0, r.y, 0]}>
          <mesh geometry={r.geometry} material={m.gold} rotation={[Math.PI / 2, 0, 0]} />
          {r.gem &&
        <mesh geometry={gemGeometry} material={m.ruby} position={[0, 0, r.radius + r.tube * 0.6]} scale={[1, 1.25, 0.6]} />
        }
        </group>
      )}
    </group>);

}