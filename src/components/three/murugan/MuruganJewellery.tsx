import React, { useMemo } from 'react';
import * as THREE from 'three';
import { InstancedSet } from '../InstancedSet';
import { chestPoint, necklacePoints, pointTransforms, ringTransforms, taperedTube } from '../../../utils/geometry';
import { getMaterials } from '../../../utils/materials';

/** Layered necklaces, choker, pendants, waist belt with sash, front chains, and anklets. */
export function MuruganJewellery() {
  const m = getMaterials();
  const j = useMemo(buildJewellery, []);

  return (
    <group name="Ornaments">
      {/* Choker */}
      <mesh geometry={j.choker} material={m.gold} />
      <InstancedSet geometry={j.gem} material={m.ruby} transforms={j.chokerGems} />

      {/* Short necklace with emerald drop */}
      <mesh geometry={j.n1} material={m.gold} />
      <InstancedSet geometry={j.bead} material={m.goldPolished} transforms={j.n1Beads} />
      <InstancedSet geometry={j.gem} material={m.ruby} transforms={j.n1Gems} />
      <group position={j.n1Pendant}>
        <mesh geometry={j.gem} material={m.emerald} position={[0, -0.022, 0.004]} scale={[1, 1.5, 0.6]} />
        <mesh geometry={j.bead} material={m.goldPolished} scale={1.2} />
      </group>

      {/* Pearl strand */}
      <mesh geometry={j.pearlCord} material={m.goldSoft} />
      <InstancedSet geometry={j.bead} material={m.pearl} transforms={j.pearls} />

      {/* Long necklace with teardrop padakkam */}
      <mesh geometry={j.n3} material={m.gold} />
      <InstancedSet geometry={j.bead} material={m.goldPolished} transforms={j.n3Beads} />
      <group position={j.n3Pendant} rotation={[-0.14, 0, 0]}>
        <mesh geometry={j.teardrop} material={m.goldPolished} />
        <mesh geometry={j.gem} material={m.ruby} position={[0, -0.006, 0.014]} scale={[1.6, 1.9, 0.6]} />
        {[-0.02, 0, 0.02].map((x) =>
        <mesh key={x} geometry={j.bead} material={m.pearl} position={[x, -0.075 - (x === 0 ? 0.012 : 0), 0.004]} scale={1.1} />
        )}
      </group>

      {/* Waist: emerald silk sash, gold belt, plaque, hanging chains */}
      <mesh geometry={j.sash} material={m.silkEmerald} />
      <mesh geometry={j.belt} material={m.gold} />
      <InstancedSet geometry={j.bead} material={m.goldPolished} transforms={j.beltBeads} />
      <group position={[0, 1.8, 0.282]}>
        <mesh geometry={j.beltPlaque} material={m.goldPolished} />
        <mesh geometry={j.gem} material={m.ruby} position={[0, 0, 0.014]} scale={[1.5, 1.5, 0.6]} />
        {[-1, 1].map((s) =>
        <mesh key={s} geometry={j.gem} material={m.emerald} position={[s * 0.038, 0, 0.01]} scale={[0.7, 0.9, 0.4]} />
        )}
      </group>
      {j.chains.map((c, i) =>
      <group key={i}>
          <mesh geometry={c.geometry} material={m.gold} />
          <mesh geometry={j.bead} material={m.pearl} position={c.end} scale={1.3} />
        </group>
      )}

      {/* Anklets with bells */}
      {[1, -1].map((s) =>
      <group key={s} position={[s * 0.16, 0.47, 0]}>
          <mesh geometry={j.anklet} material={m.gold} rotation={[Math.PI / 2, 0, 0]} />
          <InstancedSet geometry={j.bead} material={m.goldPolished} transforms={j.bells} />
        </group>
      )}
    </group>);

}

function buildJewellery() {
  const bead = new THREE.SphereGeometry(0.01, 12, 10);
  const gem = new THREE.SphereGeometry(0.012, 14, 10);

  const chokerPts: THREE.Vector3[] = [];
  for (let i = 0; i < 20; i++) {
    const a = i / 20 * Math.PI * 2;
    chokerPts.push(new THREE.Vector3(0.104 * Math.sin(a), 2.47, 0.104 * Math.cos(a)));
  }

  const n1 = necklacePoints(0.15, 2.46, 0.16, 0.012);
  const n1Curve = new THREE.CatmullRomCurve3(n1, true, 'centripetal');
  const n1Front = n1Curve.getSpacedPoints(48).filter((p) => p.z > 0.05);

  const pearlPts = necklacePoints(0.17, 2.45, 0.27, 0.014);
  const pearlCurve = new THREE.CatmullRomCurve3(pearlPts, true, 'centripetal');

  const n3 = necklacePoints(0.2, 2.44, 0.4, 0.016);
  const n3Curve = new THREE.CatmullRomCurve3(n3, true, 'centripetal');

  const teardropShape = new THREE.Shape();
  teardropShape.moveTo(0, 0.05);
  teardropShape.bezierCurveTo(0.055, 0.05, 0.06, -0.015, 0, -0.065);
  teardropShape.bezierCurveTo(-0.06, -0.015, -0.055, 0.05, 0, 0.05);
  const teardrop = new THREE.ExtrudeGeometry(teardropShape, {
    depth: 0.008,
    bevelEnabled: true,
    bevelThickness: 0.004,
    bevelSize: 0.004,
    bevelSegments: 3,
    curveSegments: 24
  });
  teardrop.translate(0, 0, -0.004);

  const ellipse = (rx: number, rz: number, y: number, n = 24) => {
    const pts: THREE.Vector3[] = [];
    for (let i = 0; i < n; i++) {
      const a = i / n * Math.PI * 2;
      pts.push(new THREE.Vector3(rx * Math.sin(a), y, rz * Math.cos(a)));
    }
    return pts;
  };

  const plaqueShape = new THREE.Shape();
  plaqueShape.moveTo(0, 0.04);
  plaqueShape.quadraticCurveTo(0.03, 0.03, 0.06, 0);
  plaqueShape.quadraticCurveTo(0.03, -0.03, 0, -0.04);
  plaqueShape.quadraticCurveTo(-0.03, -0.03, -0.06, 0);
  plaqueShape.quadraticCurveTo(-0.03, 0.03, 0, 0.04);
  const beltPlaque = new THREE.ExtrudeGeometry(plaqueShape, { depth: 0.008, bevelEnabled: true, bevelThickness: 0.003, bevelSize: 0.003, bevelSegments: 2 });

  const chains = [-1, 1].map((s) => {
    const end = new THREE.Vector3(s * 0.06, 1.36, 0.365);
    return {
      end,
      geometry: taperedTube(
        [new THREE.Vector3(s * 0.05, 1.78, 0.292), new THREE.Vector3(s * 0.07, 1.56, 0.33), end],
        () => 0.0045,
        32,
        6
      )
    };
  });

  const bells: THREE.Matrix4[] = ringTransforms(10, 0.064, 0.064, -0.016, 0.8);

  return {
    bead,
    gem,
    choker: taperedTube(chokerPts, () => 0.013, 64, 10, true),
    chokerGems: pointTransforms(ellipse(0.118, 0.118, 2.465, 18).filter((p) => p.z > -0.02), 0.85),
    n1: taperedTube(n1, () => 0.0055, 96, 8, true),
    n1Beads: pointTransforms(n1Front.filter((_, i) => i % 3 !== 0), 1.05),
    n1Gems: pointTransforms(n1Front.filter((_, i) => i % 3 === 0), 0.85),
    n1Pendant: chestPoint(0, 2.29, 0.024),
    pearlCord: taperedTube(pearlPts, () => 0.0025, 96, 6, true),
    pearls: pointTransforms(pearlCurve.getSpacedPoints(60).filter((p) => p.z > 0.04), 0.85),
    n3: taperedTube(n3, () => 0.0075, 120, 8, true),
    n3Beads: pointTransforms(n3Curve.getSpacedPoints(64).filter((p) => p.z > 0.04), 1.15),
    n3Pendant: chestPoint(0, 2.0, 0.026),
    teardrop,
    sash: taperedTube(ellipse(0.335, 0.28, 1.735, 32), () => 0.04, 96, 12, true),
    belt: taperedTube(ellipse(0.318, 0.265, 1.8, 32), () => 0.022, 96, 10, true),
    beltBeads: [...ringTransforms(44, 0.325, 0.272, 1.826, 0.75), ...ringTransforms(44, 0.325, 0.272, 1.774, 0.75, 0.07)],
    beltPlaque,
    chains,
    anklet: new THREE.TorusGeometry(0.055, 0.009, 10, 36),
    bells
  };
}