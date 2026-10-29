import React, { useMemo } from 'react';
import * as THREE from 'three';
import { InstancedSet } from '../InstancedSet';
import { createPetalGeometry } from '../../../utils/geometry';
import { getMaterials } from '../../../utils/materials';

/** Lotus pedestal; its top surface sits at y = 0.35 where the feet rest. */
export function Pedestal() {
  const m = getMaterials();
  const g = useMemo(() => {
    const petalRing = (count: number, radius: number, y: number, tilt: number, scale: number, phase: number) => {
      const out: THREE.Matrix4[] = [];
      const q = new THREE.Quaternion();
      const qy = new THREE.Quaternion();
      const qx = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1, 0, 0), -tilt);
      for (let i = 0; i < count; i++) {
        const a = phase + i / count * Math.PI * 2;
        qy.setFromAxisAngle(new THREE.Vector3(0, 1, 0), a);
        q.copy(qy).multiply(qx);
        out.push(new THREE.Matrix4().compose(new THREE.Vector3(Math.sin(a) * radius, y, Math.cos(a) * radius), q, new THREE.Vector3(scale, scale, scale)));
      }
      return out;
    };
    return {
      base: new THREE.CylinderGeometry(0.88, 0.95, 0.12, 72),
      band: new THREE.CylinderGeometry(0.84, 0.86, 0.05, 72),
      top: new THREE.CylinderGeometry(0.55, 0.6, 0.08, 64),
      rim: new THREE.TorusGeometry(0.55, 0.012, 8, 80),
      petal: createPetalGeometry(),
      outer: petalRing(22, 0.58, 0.17, 0.5, 1.4, 0),
      inner: petalRing(16, 0.4, 0.22, 0.85, 1.0, Math.PI / 16)
    };
  }, []);

  return (
    <group name="Pedestal">
      <mesh geometry={g.base} material={m.stone} position={[0, 0.06, 0]} />
      <mesh geometry={g.band} material={m.gold} position={[0, 0.145, 0]} />
      <InstancedSet geometry={g.petal} material={m.petal} transforms={g.outer} />
      <InstancedSet geometry={g.petal} material={m.petal} transforms={g.inner} />
      <mesh geometry={g.top} material={m.stone} position={[0, 0.31, 0]} />
      <mesh geometry={g.rim} material={m.goldPolished} position={[0, 0.35, 0]} rotation={[Math.PI / 2, 0, 0]} />
    </group>);

}