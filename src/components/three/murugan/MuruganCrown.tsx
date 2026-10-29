import React, { useMemo } from 'react';
import * as THREE from 'three';
import { InstancedSet } from '../InstancedSet';
import { lathe, ringTransforms } from '../../../utils/geometry';
import { getMaterials } from '../../../utils/materials';

const CROWN_PROFILE: [number, number][] = [
[0.222, 0], [0.232, 0.012], [0.236, 0.05], [0.232, 0.085], [0.214, 0.098],
[0.218, 0.15], [0.198, 0.165], [0.2, 0.21], [0.176, 0.226], [0.178, 0.27],
[0.15, 0.286], [0.152, 0.33], [0.12, 0.346], [0.12, 0.385], [0.088, 0.4],
[0.085, 0.44], [0.06, 0.47], [0.062, 0.5], [0.04, 0.53], [0.046, 0.56],
[0.03, 0.6], [0.012, 0.66], [0.0001, 0.7]];

const FINIAL_PROFILE: [number, number][] = [
[0.0001, 0], [0.03, 0.01], [0.04, 0.04], [0.03, 0.07], [0.012, 0.09],
[0.02, 0.11], [0.008, 0.15], [0.0001, 0.17]];

const BEAD_RINGS = [
{ r: 0.228, y: 0.003, n: 40, s: 0.0095, pearl: true },
{ r: 0.218, y: 0.096, n: 36, s: 0.0085, pearl: false },
{ r: 0.2, y: 0.163, n: 32, s: 0.008, pearl: false },
{ r: 0.18, y: 0.224, n: 28, s: 0.0075, pearl: false },
{ r: 0.153, y: 0.284, n: 24, s: 0.007, pearl: false },
{ r: 0.122, y: 0.344, n: 20, s: 0.0065, pearl: false },
{ r: 0.09, y: 0.398, n: 16, s: 0.006, pearl: false }];

const TIERS = [
{ y: 0.05, r: 0.236 },
{ y: 0.13, r: 0.218 },
{ y: 0.19, r: 0.2 },
{ y: 0.25, r: 0.178 },
{ y: 0.31, r: 0.152 },
{ y: 0.37, r: 0.12 }];

const DEPTH = 1.1;

/** Tiered kireedam crown with bead rings, gems, front plaque, side fans and finial, plus the prabhavali halo. */
export function MuruganCrown() {
  const m = getMaterials();
  const g = useMemo(buildCrown, []);

  return (
    <group name="Crown">
      <group position={[0, 0.18, -0.01]} scale={[1, 1, DEPTH]}>
        <mesh geometry={g.body} material={m.gold} />
        <mesh geometry={g.finial} material={m.goldPolished} position={[0, 0.66, 0]} />
        <mesh geometry={g.gem} material={m.ruby} position={[0, 0.84, 0]} scale={0.8} />
        <InstancedSet geometry={g.bead} material={m.pearl} transforms={g.pearlRing} />
        <InstancedSet geometry={g.bead} material={m.goldPolished} transforms={g.goldRings} />
      </group>

      {TIERS.map((t, i) =>
      <group key={i}>
          <mesh geometry={g.gem} material={i % 2 === 0 ? m.ruby : m.emerald} position={[0, 0.18 + t.y + 0.012, t.r * DEPTH - 0.004]} scale={[1 - i * 0.08, 1.2 - i * 0.08, 0.5]} />
          {i % 2 === 1 &&
        [-1, 1].map((s) =>
        <mesh key={s} geometry={g.gem} material={m.emerald} position={[s * t.r * Math.sin(0.75), 0.18 + t.y + 0.012, t.r * DEPTH * Math.cos(0.75) - 0.01]} scale={[0.7, 0.8, 0.45]} />
        )}
        </group>
      )}

      <group name="FrontPlaque" position={[0, 0.215, 0.246]} rotation={[-0.08, 0, 0]}>
        <mesh geometry={g.plaque} material={m.goldPolished} />
        <mesh geometry={g.gem} material={m.ruby} position={[0, 0.06, 0.012]} scale={[1.35, 1.6, 0.6]} />
        {[-1, 1].map((s) =>
        <mesh key={s} geometry={g.gem} material={m.emerald} position={[s * 0.034, 0.02, 0.01]} scale={[0.55, 0.7, 0.4]} />
        )}
      </group>

      {[-1, 1].map((s) =>
      <group key={s} name="SideFan" position={[s * 0.214, 0.17, 0.04]} rotation={[0, s * (Math.PI / 2 - 0.3), 0]}>
          <mesh geometry={g.fan} material={m.gold} />
          <mesh geometry={g.gem} material={m.ruby} position={[0, 0.026, 0.01]} scale={[0.75, 0.75, 0.45]} />
        </group>
      )}

      <group name="Prabhavali" position={[0, 0.22, -0.34]}>
        <mesh geometry={g.haloOuter} material={m.gold} />
        <mesh geometry={g.haloInner} material={m.goldSoft} />
        <InstancedSet geometry={g.spike} material={m.gold} transforms={g.spikes} />
        <InstancedSet geometry={g.bead} material={m.goldPolished} transforms={g.haloBeads} />
      </group>
    </group>);

}

function buildCrown() {
  const plaqueShape = new THREE.Shape();
  plaqueShape.moveTo(0, 0);
  plaqueShape.bezierCurveTo(0.05, 0.0, 0.06, 0.06, 0.03, 0.1);
  plaqueShape.bezierCurveTo(0.018, 0.12, 0.006, 0.14, 0, 0.165);
  plaqueShape.bezierCurveTo(-0.006, 0.14, -0.018, 0.12, -0.03, 0.1);
  plaqueShape.bezierCurveTo(-0.06, 0.06, -0.05, 0.0, 0, 0);
  const plaque = new THREE.ExtrudeGeometry(plaqueShape, {
    depth: 0.006,
    bevelEnabled: true,
    bevelThickness: 0.003,
    bevelSize: 0.003,
    bevelSegments: 2,
    curveSegments: 20
  });
  plaque.translate(0, -0.06, 0);

  const fanShape = new THREE.Shape();
  const steps = 16;
  fanShape.moveTo(-0.07, 0);
  for (let i = 0; i <= steps; i++) {
    const a = Math.PI - i / steps * Math.PI;
    const r = i % 2 === 0 ? 0.07 : 0.062;
    fanShape.lineTo(Math.cos(a) * r, Math.sin(a) * r);
  }
  fanShape.lineTo(-0.07, 0);
  const fan = new THREE.ExtrudeGeometry(fanShape, { depth: 0.006, bevelEnabled: true, bevelThickness: 0.002, bevelSize: 0.002, bevelSegments: 1 });

  const goldRings = BEAD_RINGS.filter((r) => !r.pearl).flatMap((r) => ringTransforms(r.n, r.r, r.r, r.y, r.s / 0.01));
  const pearlRing = BEAD_RINGS.filter((r) => r.pearl).flatMap((r) => ringTransforms(r.n, r.r, r.r, r.y, r.s / 0.01));

  const spikes: THREE.Matrix4[] = [];
  const spikeCount = 30;
  for (let i = 0; i < spikeCount; i++) {
    const a = i / spikeCount * Math.PI * 2;
    const s = i % 2 === 0 ? 1 : 0.65;
    spikes.push(
      new THREE.Matrix4().compose(
        new THREE.Vector3(Math.cos(a) * 0.53, Math.sin(a) * 0.53, 0),
        new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 0, 1), a - Math.PI / 2),
        new THREE.Vector3(s, s, s)
      )
    );
  }
  const haloBeads: THREE.Matrix4[] = [];
  for (let i = 0; i < 40; i++) {
    const a = i / 40 * Math.PI * 2;
    haloBeads.push(
      new THREE.Matrix4().compose(new THREE.Vector3(Math.cos(a) * 0.478, Math.sin(a) * 0.478, 0.006), new THREE.Quaternion(), new THREE.Vector3(0.7, 0.7, 0.7))
    );
  }

  return {
    body: lathe(CROWN_PROFILE, 64),
    finial: lathe(FINIAL_PROFILE, 32),
    bead: new THREE.SphereGeometry(0.01, 10, 8),
    gem: new THREE.SphereGeometry(0.016, 16, 12),
    plaque,
    fan,
    goldRings,
    pearlRing,
    haloOuter: new THREE.TorusGeometry(0.5, 0.016, 12, 96),
    haloInner: new THREE.TorusGeometry(0.455, 0.008, 8, 96),
    spike: new THREE.ConeGeometry(0.024, 0.09, 8),
    spikes,
    haloBeads
  };
}