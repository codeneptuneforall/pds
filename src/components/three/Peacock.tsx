import React, { useCallback, useLayoutEffect, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { capsule, lerp, smoothstep, taperedTube } from '../../utils/geometry';
import { getMaterials } from '../../utils/materials';
import { cinematicState } from '../../utils/cinematicState';
import { TRAIN_COUNT, TRAIN_ROOT, TRAIN_ROWS, createEyeGeometry, createVaneGeometry, hash } from '../../utils/peacockGeometry';

const X = new THREE.Vector3(1, 0, 0);
const Z = new THREE.Vector3(0, 0, 1);
const CREST = [-0.42, -0.28, -0.14, 0, 0.14, 0.28, 0.42];

/** Fully procedural peacock (faces +Z, feet at y = 0). The instanced train fans with cinematicState.peacockFan. */
export function Peacock() {
  const m = getMaterials();
  const vaneRef = useRef<THREE.InstancedMesh>(null);
  const eyeRef = useRef<THREE.InstancedMesh>(null);
  const lastFan = useRef(-1);
  const g = useMemo(buildPeacock, []);
  const tmp = useMemo(
    () => ({
      q: new THREE.Quaternion(),
      qx: new THREE.Quaternion(),
      qz: new THREE.Quaternion(),
      pos: new THREE.Vector3(),
      off: new THREE.Vector3(),
      scl: new THREE.Vector3(),
      mat: new THREE.Matrix4()
    }),
    []
  );

  const writeTrain = useCallback(
    (fan: number) => {
      const vane = vaneRef.current;
      const eye = eyeRef.current;
      if (!vane || !eye) return;
      const f = smoothstep(0, 1, fan);
      let idx = 0;
      for (const row of TRAIN_ROWS) {
        for (let i = 0; i < row.count; i++) {
          const u = i / (row.count - 1);
          const spreadOpen = lerp(-1.42, 1.42, u) + (hash(idx) - 0.5) * 0.04;
          const spread = lerp(spreadOpen * 0.07, spreadOpen, f);
          const elev = lerp(-0.32 + row.elevOffset * 0.3, 1.18 + row.elevOffset, f) - Math.abs(2 * u - 1) * 0.12 * f;
          tmp.qx.setFromAxisAngle(X, -Math.PI / 2 + elev);
          tmp.qz.setFromAxisAngle(Z, spread);
          tmp.q.copy(tmp.qz).multiply(tmp.qx);
          tmp.pos.set(TRAIN_ROOT.x, TRAIN_ROOT.y + hash(idx + 3) * 0.004, TRAIN_ROOT.z + row.depth);
          const length = row.length * (0.96 + hash(idx + 7) * 0.08);
          tmp.scl.set(1, length, 1);
          tmp.mat.compose(tmp.pos, tmp.q, tmp.scl);
          vane.setMatrixAt(idx, tmp.mat);
          tmp.off.set(0, length - 0.06, 0.004).applyQuaternion(tmp.q).add(tmp.pos);
          const es = 0.85 + 0.15 * row.length;
          tmp.scl.set(es, es, es);
          tmp.mat.compose(tmp.off, tmp.q, tmp.scl);
          eye.setMatrixAt(idx, tmp.mat);
          idx++;
        }
      }
      vane.instanceMatrix.needsUpdate = true;
      eye.instanceMatrix.needsUpdate = true;
    },
    [tmp]
  );

  useLayoutEffect(() => {
    writeTrain(0);
    lastFan.current = 0;
  }, [writeTrain]);

  useFrame(() => {
    const fan = cinematicState.peacockFan;
    if (Math.abs(fan - lastFan.current) > 0.0005) {
      writeTrain(fan);
      lastFan.current = fan;
    }
  });

  return (
    <group name="Peacock">
      {/* Body & plumage */}
      <mesh geometry={g.sphere} material={m.peacockBlue} position={[0, 0.55, 0]} rotation={[0.25, 0, 0]} scale={[0.15, 0.16, 0.27]} />
      <mesh geometry={g.sphere} material={m.peacockGreen} position={[0, 0.62, -0.07]} rotation={[0.15, 0, 0]} scale={[0.14, 0.1, 0.24]} />
      {[-1, 1].map((s) =>
      <group key={s}>
          <mesh geometry={g.sphere} material={m.wing} position={[s * 0.135, 0.58, -0.04]} rotation={[0.25, s * 0.08, 0]} scale={[0.035, 0.12, 0.22]} />
          <mesh geometry={g.sphere} material={m.peacockGreen} position={[s * 0.12, 0.55, -0.2]} rotation={[0.1, 0, 0]} scale={[0.03, 0.06, 0.12]} />
        </group>
      )}

      {/* Neck & head */}
      <mesh geometry={g.neck} material={m.peacockBlue} />
      <mesh geometry={g.sphere} material={m.peacockBlue} position={[0, 1.05, 0.22]} scale={[0.047, 0.05, 0.063]} />
      <mesh geometry={g.beak} material={m.beak} position={[0, 1.04, 0.3]} rotation={[Math.PI / 2, 0, 0]} />
      {[-1, 1].map((s) =>
      <group key={s}>
          <mesh geometry={g.sphere} material={m.birdEye} position={[s * 0.04, 1.06, 0.245]} scale={0.011} />
          <mesh geometry={g.sphere} material={m.glint} position={[s * 0.044, 1.065, 0.254]} scale={0.003} />
          <mesh geometry={g.sphere} material={m.birdWhite} position={[s * 0.043, 1.077, 0.232]} rotation={[0, 0, s * 0.2]} scale={[0.004, 0.006, 0.024]} />
          <mesh geometry={g.sphere} material={m.birdWhite} position={[s * 0.043, 1.044, 0.236]} rotation={[0, 0, -s * 0.2]} scale={[0.004, 0.005, 0.02]} />
        </group>
      )}

      {/* Crest */}
      {CREST.map((a) =>
      <group key={a} position={[0, 1.095, 0.2]} rotation={[-0.25, 0, a]}>
          <mesh geometry={g.crestStalk} material={m.beak} position={[0, 0.04, 0]} />
          <mesh geometry={g.sphere} material={m.peacockBlue} position={[0, 0.085, 0]} scale={[0.012, 0.016, 0.006]} />
        </group>
      )}

      {/* Legs & feet */}
      {[-1, 1].map((s) =>
      <group key={s} position={[s * 0.06, 0, 0.02]}>
          <mesh geometry={g.leg} material={m.leg} position={[0, 0.22, 0]} />
          {[-0.5, 0, 0.5].map((a) =>
        <mesh key={a} geometry={capsule(0.008, 0.05)} material={m.leg} position={[Math.sin(a) * 0.03, 0.008, Math.cos(a) * 0.03]} rotation={[Math.PI / 2, 0, -a]} />
        )}
          <mesh geometry={capsule(0.007, 0.03)} material={m.leg} position={[0, 0.008, -0.025]} rotation={[Math.PI / 2, 0, 0]} />
        </group>
      )}

      {/* Instanced train */}
      <instancedMesh ref={vaneRef} args={[g.vane, m.featherVane, TRAIN_COUNT]} frustumCulled={false} />
      <instancedMesh ref={eyeRef} args={[g.eye, m.featherEye, TRAIN_COUNT]} frustumCulled={false} />
    </group>);

}

function buildPeacock() {
  return {
    sphere: new THREE.SphereGeometry(1, 28, 20),
    neck: taperedTube(
      [
      new THREE.Vector3(0, 0.6, 0.16),
      new THREE.Vector3(0, 0.78, 0.21),
      new THREE.Vector3(0, 0.92, 0.17),
      new THREE.Vector3(0, 1.03, 0.21)],

      (t) => lerp(0.075, 0.04, t),
      32,
      14
    ),
    beak: new THREE.ConeGeometry(0.016, 0.07, 12),
    crestStalk: new THREE.CylinderGeometry(0.0022, 0.0028, 0.08, 6),
    leg: new THREE.CylinderGeometry(0.011, 0.013, 0.42, 10),
    vane: createVaneGeometry(),
    eye: createEyeGeometry()
  };
}