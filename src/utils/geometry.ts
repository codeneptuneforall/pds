import * as THREE from 'three';
import { mergeVertices } from 'three/examples/jsm/utils/BufferGeometryUtils.js';

export type Vec3 = [number, number, number];

export function clamp(v: number, min: number, max: number) {
  return Math.min(max, Math.max(min, v));
}
export function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}
export function smoothstep(e0: number, e1: number, x: number) {
  const t = clamp((x - e0) / (e1 - e0), 0, 1);
  return t * t * (3 - 2 * t);
}

/* ------------------------------------------------------------------ */
/* Head — a sculpted surface, not a sphere with stickers               */
/* ------------------------------------------------------------------ */

const HEAD_SCALE = new THREE.Vector3(0.25, 0.31, 0.27);
type HeadFeature = {c: THREE.Vector3;s: number;a: number;};
const feature = (x: number, y: number, z: number, s: number, a: number): HeadFeature => ({
  c: new THREE.Vector3(x, y, z).normalize(),
  s,
  a
});

const HEAD_FEATURES: HeadFeature[] = [
feature(0.55, -0.22, 0.8, 0.24, 0.02), // cheeks
feature(-0.55, -0.22, 0.8, 0.24, 0.02),
feature(0.36, 0.08, 0.93, 0.13, -0.028), // eye sockets
feature(-0.36, 0.08, 0.93, 0.13, -0.028),
feature(0.3, 0.28, 0.91, 0.12, 0.009), // brow ridges
feature(-0.3, 0.28, 0.91, 0.12, 0.009),
feature(0, 0.02, 1, 0.09, 0.012), // nose bridge
feature(0, -0.85, 0.55, 0.2, 0.014), // chin
feature(0, 0.35, -0.6, 0.55, 0.025), // cranium
feature(0.9, 0.3, 0.2, 0.22, -0.008), // temples
feature(-0.9, 0.3, 0.2, 0.22, -0.008),
feature(0, 0.55, 0.85, 0.3, 0.008) // forehead
];

export function shapeHead(dir: THREE.Vector3, out: THREE.Vector3) {
  out.set(dir.x * HEAD_SCALE.x, dir.y * HEAD_SCALE.y, dir.z * HEAD_SCALE.z);
  if (dir.y < 0) {
    const t = Math.pow(-dir.y, 1.6);
    out.x *= 1 - 0.3 * t; // jaw taper
    out.z *= 1 - (dir.z < 0 ? 0.2 : 0.08) * t;
  }
  let d = 0;
  for (const f of HEAD_FEATURES) d += f.a * Math.exp(-dir.distanceToSquared(f.c) / (2 * f.s * f.s));
  out.addScaledVector(dir, d);
  return out;
}

export function createHeadGeometry(widthSegments = 72) {
  let g: THREE.BufferGeometry = new THREE.SphereGeometry(1, widthSegments, Math.round(widthSegments * 0.75));
  g.rotateY(-Math.PI / 2); // seam to the back of the head
  g.deleteAttribute('normal');
  g.deleteAttribute('uv');
  g = mergeVertices(g);
  const pos = g.getAttribute('position') as THREE.BufferAttribute;
  const d = new THREE.Vector3();
  const o = new THREE.Vector3();
  for (let i = 0; i < pos.count; i++) {
    d.fromBufferAttribute(pos, i).normalize();
    shapeHead(d, o);
    pos.setXYZ(i, o.x, o.y, o.z);
  }
  g.computeVertexNormals();
  return g;
}

/** A point on the sculpted head surface plus its normal, used to seat facial features. */
export function headSurface(x: number, y: number, z: number, lift = 0) {
  const d = new THREE.Vector3(x, y, z).normalize();
  const p = shapeHead(d, new THREE.Vector3());
  const helper = Math.abs(d.y) > 0.9 ? new THREE.Vector3(1, 0, 0) : new THREE.Vector3(0, 1, 0);
  const t1 = new THREE.Vector3().crossVectors(d, helper).normalize();
  const t2 = new THREE.Vector3().crossVectors(d, t1).normalize();
  const e = 0.01;
  const p1 = shapeHead(d.clone().addScaledVector(t1, e).normalize(), new THREE.Vector3()).sub(p);
  const p2 = shapeHead(d.clone().addScaledVector(t2, e).normalize(), new THREE.Vector3()).sub(p);
  const n = new THREE.Vector3().crossVectors(p1, p2).normalize();
  if (n.dot(d) < 0) n.negate();
  return { point: p.addScaledVector(n, lift), normal: n };
}

export function quaternionFromZ(direction: THREE.Vector3) {
  return new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 0, 1), direction.clone().normalize());
}

/* ------------------------------------------------------------------ */
/* Tubes, limbs, lathes                                                */
/* ------------------------------------------------------------------ */

export function taperedTube(
points: THREE.Vector3[],
radius: (t: number) => number,
tubular = 48,
radial = 12,
closed = false)
{
  const curve = new THREE.CatmullRomCurve3(points, closed, 'centripetal');
  const g = new THREE.TubeGeometry(curve, tubular, 1, radial, closed);
  const pos = g.getAttribute('position') as THREE.BufferAttribute;
  const c = new THREE.Vector3();
  const v = new THREE.Vector3();
  for (let i = 0; i <= tubular; i++) {
    const t = i / tubular;
    curve.getPointAt(closed && i === tubular ? 0 : t, c);
    const r = radius(t);
    for (let j = 0; j <= radial; j++) {
      const idx = i * (radial + 1) + j;
      v.fromBufferAttribute(pos, idx).sub(c).multiplyScalar(r).add(c);
      pos.setXYZ(idx, v.x, v.y, v.z);
    }
  }
  g.computeVertexNormals();
  return g;
}

export function limbRadiusAt(t: number, r1: number, r2: number, bulge: number) {
  return r1 + (r2 - r1) * t + bulge * Math.pow(Math.sin(Math.PI * t), 1.4) * (1 - t * 0.4);
}

/** Rounded, tapered limb along +Y with an optional muscle bulge. */
export function limbGeometry(length: number, r1: number, r2: number, bulge = 0, radial = 20) {
  const pts: THREE.Vector2[] = [];
  const cap = 6;
  for (let i = 0; i <= cap; i++) {
    const a = -Math.PI / 2 + i / cap * (Math.PI / 2);
    pts.push(new THREE.Vector2(Math.max(Math.cos(a) * r1, 0.0001), Math.sin(a) * r1 * 0.8));
  }
  const body = 14;
  for (let i = 1; i < body; i++) {
    const t = i / body;
    pts.push(new THREE.Vector2(limbRadiusAt(t, r1, r2, bulge), t * length));
  }
  for (let i = 0; i <= cap; i++) {
    const a = i / cap * (Math.PI / 2);
    pts.push(new THREE.Vector2(Math.max(Math.cos(a) * r2, 0.0001), length + Math.sin(a) * r2 * 0.8));
  }
  return new THREE.LatheGeometry(pts, radial);
}

export function alignBetween(a: Vec3, b: Vec3) {
  const va = new THREE.Vector3(...a);
  const dir = new THREE.Vector3(...b).sub(va);
  const length = dir.length();
  const quaternion = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir.normalize());
  return { position: va, quaternion, length };
}

export function lathe(profile: [number, number][], segments = 48) {
  return new THREE.LatheGeometry(
    profile.map(([r, y]) => new THREE.Vector2(r, y)),
    segments
  );
}

const capsuleCache = new Map<string, THREE.CapsuleGeometry>();
export function capsule(radius: number, length: number) {
  const key = `${radius.toFixed(4)}-${length.toFixed(4)}`;
  let g = capsuleCache.get(key);
  if (!g) {
    g = new THREE.CapsuleGeometry(radius, length, 5, 12);
    capsuleCache.set(key, g);
  }
  return g;
}

/* ------------------------------------------------------------------ */
/* Torso and necklace placement                                        */
/* ------------------------------------------------------------------ */

const TORSO_NODES: [number, number][] = [
[1.52, 0.27],
[1.65, 0.265],
[1.78, 0.255],
[1.95, 0.28],
[2.1, 0.318],
[2.24, 0.342],
[2.34, 0.332],
[2.41, 0.27],
[2.46, 0.165],
[2.5, 0.1],
[2.53, 0]];

export const TORSO_DEPTH = 0.62;

export function torsoRadius(y: number) {
  const n = TORSO_NODES;
  if (y <= n[0][0]) return n[0][1];
  if (y >= n[n.length - 1][0]) return 0;
  let i = 0;
  while (i < n.length - 2 && y > n[i + 1][0]) i++;
  const t = (y - n[i][0]) / (n[i + 1][0] - n[i][0]);
  const p0 = n[Math.max(i - 1, 0)][1];
  const p1 = n[i][1];
  const p2 = n[i + 1][1];
  const p3 = n[Math.min(i + 2, n.length - 1)][1];
  const r =
  0.5 * (2 * p1 + (-p0 + p2) * t + (2 * p0 - 5 * p1 + 4 * p2 - p3) * t * t + (-p0 + 3 * p1 - 3 * p2 + p3) * t * t * t);
  return Math.max(0, r);
}

export function createTorsoGeometry() {
  const pts: THREE.Vector2[] = [];
  const steps = 64;
  for (let i = 0; i <= steps; i++) {
    const y = lerp(1.52, 2.53, i / steps);
    pts.push(new THREE.Vector2(i === steps ? 0.0001 : torsoRadius(y), y));
  }
  return new THREE.LatheGeometry(pts, 48);
}

export function chestPoint(x: number, y: number, lift: number) {
  const r = torsoRadius(y);
  return new THREE.Vector3(x, y, TORSO_DEPTH * Math.sqrt(Math.max(r * r - x * x, 0)) + lift);
}

/** A closed necklace draped over the chest surface. */
export function necklacePoints(width: number, yTop: number, drop: number, lift: number, steps = 26) {
  const pts: THREE.Vector3[] = [];
  for (let i = 0; i <= steps; i++) {
    const u = -1 + 2 * i / steps;
    const x = width * Math.sin(u * Math.PI / 2);
    const y = yTop - drop * Math.pow(Math.cos(u * Math.PI / 2), 1.6);
    pts.push(chestPoint(x, y, lift));
  }
  pts.push(new THREE.Vector3(width * 0.8, yTop + 0.01, -0.1));
  pts.push(new THREE.Vector3(0, yTop + 0.02, -0.13));
  pts.push(new THREE.Vector3(-width * 0.8, yTop + 0.01, -0.1));
  return pts;
}

/* ------------------------------------------------------------------ */
/* Silk dhoti with sculptural folds                                    */
/* ------------------------------------------------------------------ */

function dhotiRadius(v: number) {
  return 0.305 + 0.07 * v + 0.05 * v * v;
}
function dhotiAmp(v: number) {
  return 0.004 + 0.03 * Math.pow(Math.max(v, 0), 1.2);
}

export function createDhotiGeometry(radialSegments = 160, heightSegments = 64) {
  const positions: number[] = [];
  const colors: number[] = [];
  const indices: number[] = [];
  const maroon = new THREE.Color('#7d1f2c');
  const deep = new THREE.Color('#4e121b');
  const gold = new THREE.Color('#c99a3e');
  const saffron = new THREE.Color('#e07a22');
  const c = new THREE.Color();
  const tuck = 0.08;

  for (let iy = 0; iy <= heightSegments; iy++) {
    const v = -tuck + iy / heightSegments * (1 + tuck);
    for (let ix = 0; ix <= radialSegments; ix++) {
      const th = Math.PI + ix / radialSegments * Math.PI * 2;
      const vv = Math.max(v, 0);
      const wave = Math.sin(9 * th + 1.6 * vv * Math.sin(3 * th));
      const amp = dhotiAmp(vv);
      const r = dhotiRadius(vv) + amp * wave + amp * 0.45 * Math.sin(17 * th + 1.3 + vv * 2);
      let x = r * Math.sin(th);
      let y = 1.82 - vv * 1.08 + 0.015 * Math.sin(5 * th) * vv * vv * vv;
      let z = r * Math.cos(th) * 0.82;
      if (v < 0) {
        // fold the top edge inward onto the torso so no gap is visible
        const k = -v / tuck;
        const tr = torsoRadius(1.84);
        x = lerp(x, tr * Math.sin(th), k);
        z = lerp(z, tr * Math.cos(th) * TORSO_DEPTH, k);
        y = 1.83;
      }
      positions.push(x, y, z);

      if (v < 0.035) c.copy(gold);else
      if (vv > 0.86 && vv < 0.9) c.copy(gold);else
      if (vv >= 0.9 && vv < 0.95) c.copy(saffron);else
      if (vv >= 0.95 && vv < 0.975) c.copy(gold);else
      c.copy(maroon).lerp(deep, (0.5 - 0.5 * wave) * 0.35 * smoothstep(0.05, 0.6, vv));
      colors.push(c.r, c.g, c.b);
    }
  }
  const row = radialSegments + 1;
  for (let iy = 0; iy < heightSegments; iy++) {
    for (let ix = 0; ix < radialSegments; ix++) {
      const a = iy * row + ix;
      const b = a + row;
      indices.push(a, b, a + 1, b, b + 1, a + 1);
    }
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  g.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
  g.setIndex(indices);
  g.computeVertexNormals();
  return g;
}

/** Front pleated fan (kosuvam) hanging over the dhoti. */
export function createPleatGeometry(cols = 56, rows = 40) {
  const positions: number[] = [];
  const colors: number[] = [];
  const indices: number[] = [];
  const saffron = new THREE.Color('#e8892a');
  const shade = new THREE.Color('#b85d18');
  const gold = new THREE.Color('#d4a64a');
  const c = new THREE.Color();
  for (let iy = 0; iy <= rows; iy++) {
    const v = iy / rows;
    const y = 1.76 - v * 0.98;
    const sv = (1.82 - y) / 1.08;
    const R = dhotiRadius(sv) + dhotiAmp(sv) * 1.45;
    const halfW = 0.06 + 0.07 * v;
    for (let ix = 0; ix <= cols; ix++) {
      const u = -1 + 2 * ix / cols;
      const x = u * halfW;
      const tri = Math.abs(((u * 4 + 1) % 2 + 2) % 2 - 1);
      const z = Math.sqrt(Math.max(R * R - x * x, 0)) * 0.82 + 0.012 + 0.018 * (0.4 + v) * tri;
      positions.push(x, y, z);
      if (Math.abs(u) > 0.86 || v > 0.93) c.copy(gold);else
      c.copy(saffron).lerp(shade, (1 - tri) * 0.45);
      colors.push(c.r, c.g, c.b);
    }
  }
  const row = cols + 1;
  for (let iy = 0; iy < rows; iy++) {
    for (let ix = 0; ix < cols; ix++) {
      const a = iy * row + ix;
      const b = a + row;
      indices.push(a, b, a + 1, b, b + 1, a + 1);
    }
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  g.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
  g.setIndex(indices);
  g.computeVertexNormals();
  return g;
}

/* ------------------------------------------------------------------ */
/* Vel blade — leaf shape, central ridge, sharp edges                  */
/* ------------------------------------------------------------------ */

export function createVelBladeGeometry(length = 0.55, maxWidth = 0.115, thickness = 0.022, segU = 10, segV = 48) {
  const width = (v: number) =>
  Math.max(0, 0.022 * (1 - v) + maxWidth * Math.pow(Math.max(0, Math.sin(Math.PI * Math.pow(v, 0.72))), 0.85));
  const thick = (v: number) => thickness * (1 - 0.8 * v);
  const positions: number[] = [];
  const indices: number[] = [];
  let offset = 0;
  for (const side of [-1, 1]) {
    for (const face of [-1, 1]) {
      for (let iv = 0; iv <= segV; iv++) {
        const v = iv / segV;
        for (let iu = 0; iu <= segU; iu++) {
          const u = iu / segU;
          positions.push(side * u * width(v), v * length, face * thick(v) * Math.pow(1 - u, 1.1));
        }
      }
      const flip = side * face > 0;
      const row = segU + 1;
      for (let iv = 0; iv < segV; iv++) {
        for (let iu = 0; iu < segU; iu++) {
          const a = offset + iv * row + iu;
          const b = a + row;
          if (flip) indices.push(a, a + 1, b, b, a + 1, b + 1);else
          indices.push(a, b, a + 1, b, b + 1, a + 1);
        }
      }
      offset += (segV + 1) * row;
    }
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  g.setIndex(indices);
  g.computeVertexNormals();
  return g;
}

/* ------------------------------------------------------------------ */
/* Lotus petal                                                         */
/* ------------------------------------------------------------------ */

export function createPetalGeometry() {
  const g = new THREE.SphereGeometry(1, 20, 12);
  g.scale(0.1, 0.03, 0.2);
  g.translate(0, 0, 0.17);
  const pos = g.getAttribute('position') as THREE.BufferAttribute;
  const colors: number[] = [];
  const base = new THREE.Color('#8e2a40');
  const tip = new THREE.Color('#f0c4b4');
  const c = new THREE.Color();
  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i);
    const y = pos.getY(i);
    const z = pos.getZ(i);
    const k = smoothstep(0.12, 0.37, z);
    pos.setXYZ(i, x * (1 - 0.75 * k), y + 0.07 * k * k, z);
    c.copy(base).lerp(tip, smoothstep(0.05, 0.37, z));
    colors.push(c.r, c.g, c.b);
  }
  g.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
  g.computeVertexNormals();
  return g;
}

/* ------------------------------------------------------------------ */
/* Instance transform helpers                                          */
/* ------------------------------------------------------------------ */

export function ringTransforms(count: number, rx: number, rz: number, y: number, scale: number, phase = 0) {
  const out: THREE.Matrix4[] = [];
  for (let i = 0; i < count; i++) {
    const a = phase + i / count * Math.PI * 2;
    out.push(new THREE.Matrix4().compose(
      new THREE.Vector3(rx * Math.sin(a), y, rz * Math.cos(a)),
      new THREE.Quaternion(),
      new THREE.Vector3(scale, scale, scale)
    ));
  }
  return out;
}

export function pointTransforms(points: THREE.Vector3[], scale: number) {
  return points.map((p) =>
  new THREE.Matrix4().compose(p, new THREE.Quaternion(), new THREE.Vector3(scale, scale, scale))
  );
}