import React, { useMemo } from 'react';
import * as THREE from 'three';
import { createHeadGeometry, headSurface, quaternionFromZ, taperedTube } from '../../../utils/geometry';
import { getMaterials } from '../../../utils/materials';

const EYE_R = 0.052;
const LID_THETA = 1.18;
const LID_R = EYE_R * 1.07;

type MuruganHeadProps = {detail?: 'high' | 'low';};

/** Sculpted head: cranium, cheeks, jaw, sockets, lidded eyes, nose, lips, ears, hair, earrings, forehead marks. */
export function MuruganHead({ detail = 'high' }: MuruganHeadProps) {
  const m = getMaterials();
  const p = useMemo(() => buildHead(detail === 'high' ? 72 : 48), [detail]);

  return (
    <group name="Face">
      <mesh geometry={p.head} material={m.skin} />

      {p.eyes.map((eye) =>
      <group key={eye.side} position={eye.position} quaternion={eye.quaternion}>
          <mesh geometry={p.eyeWhite} material={m.eyeWhite} />
          <mesh geometry={p.iris} material={m.iris} position={[0, 0, EYE_R + 0.003 - 0.031]} />
          <mesh geometry={p.pupil} material={m.pupil} position={[0, 0, EYE_R + 0.0045 - 0.016]} />
          <mesh geometry={p.glint} material={m.glint} position={[0.011, 0.013, EYE_R + 0.004]} />
          <group rotation={[0.12, 0, 0]}>
            <mesh geometry={p.upperLid} material={m.skin} />
            <mesh geometry={p.liner} material={m.kohl} position={[0, LID_R * Math.cos(LID_THETA), 0]} rotation={[Math.PI / 2, 0, 0]} />
          </group>
          <mesh geometry={p.lowerLid} material={m.skin} />
        </group>
      )}

      {p.brows.map((g, i) =>
      <mesh key={i} geometry={g} material={m.brow} />
      )}

      <mesh geometry={p.noseBridge} material={m.skin} />
      <mesh geometry={p.sphere} material={m.skin} position={p.noseTip} scale={[0.028, 0.022, 0.024]} />
      {[-1, 1].map((s) =>
      <mesh key={s} geometry={p.sphere} material={m.skin} position={[p.noseTip.x + s * 0.024, p.noseTip.y - 0.01, p.noseTip.z - 0.016]} scale={0.016} />
      )}

      <mesh geometry={p.upperLip} material={m.lip} />
      <mesh geometry={p.lowerLip} material={m.lip} />
      <mesh geometry={p.mouthLine} material={m.mouthLine} />

      {p.ears.map((ear) =>
      <group key={ear.side} position={ear.position} rotation={[0, ear.side * 0.35, 0]}>
          <mesh geometry={p.sphere} material={m.skin} scale={[0.016, 0.066, 0.04]} />
          <mesh geometry={p.sphere} material={m.skin} position={[0, -0.058, 0.004]} scale={[0.011, 0.018, 0.016]} />
          <group name="Earring" position={[ear.side * 0.006, -0.072, 0.004]}>
            <mesh geometry={p.sphere} material={m.ruby} scale={0.011} />
            <mesh geometry={p.earRing} material={m.gold} position={[0, -0.042, 0]} rotation={[0, Math.PI / 2, 0]} />
            <mesh geometry={p.earCone} material={m.gold} position={[0, -0.078, 0]} rotation={[Math.PI, 0, 0]} />
            <mesh geometry={p.sphere} material={m.pearl} position={[0, -0.1, 0]} scale={0.012} />
          </group>
        </group>
      )}

      <mesh geometry={p.hairShell} material={m.hair} position={[0, 0.012, -0.004]} scale={[0.268, 0.325, 0.29]} />
      {p.locks.map((g, i) =>
      <mesh key={i} geometry={g} material={m.hair} />
      )}

      {p.vibhuti.map((g, i) =>
      <mesh key={i} geometry={g} material={m.vibhuti} />
      )}
      <mesh geometry={p.sphere} material={m.kumkum} position={p.kumkum.position} quaternion={p.kumkum.quaternion} scale={[0.011, 0.014, 0.005]} />
    </group>);

}

function surfaceCurve(points: [number, number, number][], lift: number) {
  return points.map(([x, y, z]) => headSurface(x, y, z, lift).point);
}

function buildHead(segments: number) {
  const sphere = new THREE.SphereGeometry(1, 20, 16);

  const eyes = [-1, 1].map((side) => {
    const { point, normal } = headSurface(side * 0.36, 0.08, 0.93);
    return {
      side,
      position: point.clone().addScaledVector(normal, -0.036),
      quaternion: quaternionFromZ(new THREE.Vector3(0, -0.06, 1))
    };
  });

  const brows = [-1, 1].map((s) =>
  taperedTube(
    surfaceCurve(
      [
      [s * 0.13, 0.29, 0.95],
      [s * 0.3, 0.345, 0.89],
      [s * 0.47, 0.32, 0.8],
      [s * 0.6, 0.22, 0.74]],

      0.008
    ),
    (t) => 0.0075 * (1 - 0.55 * t) + 0.001,
    24,
    8
  )
  );

  const tipBase = headSurface(0, -0.14, 1);
  const noseTip = tipBase.point.clone().addScaledVector(tipBase.normal, 0.035);
  const noseBridge = taperedTube(
    [
    headSurface(0, 0.15, 1, 0.004).point,
    headSurface(0, 0.0, 1, 0.016).point,
    noseTip.clone().add(new THREE.Vector3(0, 0.012, -0.012))],

    (t) => 0.011 + 0.01 * t,
    20,
    10
  );

  const lipLine = (fn: (u: number) => [number, number, number], lift: number) => {
    const pts: [number, number, number][] = [];
    for (let i = 0; i <= 10; i++) pts.push(fn(-1 + i / 5));
    return surfaceCurve(pts, lift);
  };
  const upperLip = taperedTube(
    lipLine((u) => [u * 0.19, -0.425 + 0.018 * u * u - 0.008 * Math.exp(-u * u * 30), 0.9], 0.006),
    (t) => {
      const u = 2 * t - 1;
      return 0.011 * (0.4 + 0.6 * (1 - u * u));
    },
    24,
    10
  );
  const lowerLip = taperedTube(
    lipLine((u) => [u * 0.16, -0.49 + 0.035 * u * u, 0.9], 0.007),
    (t) => {
      const u = 2 * t - 1;
      return 0.0135 * (0.35 + 0.65 * (1 - u * u));
    },
    24,
    10
  );
  const mouthLine = taperedTube(lipLine((u) => [u * 0.2, -0.455 + 0.022 * u * u, 0.9], 0.0035), () => 0.0028, 20, 6);

  const ears = [-1, 1].map((side) => ({
    side,
    position: headSurface(side, -0.02, 0.15).point.add(new THREE.Vector3(side * 0.008, 0, -0.01))
  }));

  const hairShell = new THREE.SphereGeometry(1, 40, 28, Math.PI - 0.1, Math.PI + 0.2, 0, Math.PI * 0.72);

  const locks: THREE.BufferGeometry[] = [];
  for (let k = 0; k < 7; k++) {
    const a = -0.95 + k / 6 * 1.9;
    const sa = Math.sin(a);
    const ca = Math.cos(a);
    locks.push(
      taperedTube(
        [
        new THREE.Vector3(0.2 * sa, -0.02, -0.25 * ca),
        new THREE.Vector3(0.23 * sa, -0.2, -0.27 * ca - 0.01),
        new THREE.Vector3(0.25 * sa + 0.01 * Math.sin(k), -0.38, -0.27 * ca - 0.03),
        new THREE.Vector3(0.27 * sa, -0.56, -0.25 * ca - 0.05)],

        (t) => 0.034 * (1 - 0.7 * t) + 0.006,
        24,
        10
      )
    );
  }

  const vibhuti = [0.42, 0.47, 0.52].map((y) => {
    const pts: [number, number, number][] = [];
    for (let i = 0; i <= 6; i++) pts.push([-0.2 + i / 6 * 0.4, y, 0.95]);
    return taperedTube(surfaceCurve(pts, 0.0025), (t) => 0.004 * (0.6 + 0.4 * Math.sin(Math.PI * t)), 24, 6);
  });
  const k = headSurface(0, 0.47, 0.95, 0.004);

  return {
    head: createHeadGeometry(segments),
    sphere,
    eyes,
    eyeWhite: new THREE.SphereGeometry(EYE_R, 32, 24),
    iris: new THREE.SphereGeometry(0.031, 28, 20),
    pupil: new THREE.SphereGeometry(0.016, 20, 14),
    glint: new THREE.SphereGeometry(0.0065, 12, 8),
    upperLid: new THREE.SphereGeometry(LID_R, 32, 12, 0, Math.PI * 2, 0, LID_THETA),
    lowerLid: new THREE.SphereGeometry(EYE_R * 1.04, 32, 8, 0, Math.PI * 2, Math.PI - 0.62, 0.62),
    liner: new THREE.TorusGeometry(LID_R * Math.sin(LID_THETA), 0.0042, 8, 32, Math.PI),
    brows,
    noseTip,
    noseBridge,
    upperLip,
    lowerLip,
    mouthLine,
    ears,
    earRing: new THREE.TorusGeometry(0.03, 0.0065, 10, 32),
    earCone: new THREE.ConeGeometry(0.009, 0.026, 12),
    hairShell,
    locks,
    vibhuti,
    kumkum: { position: k.point, quaternion: quaternionFromZ(k.normal) }
  };
}