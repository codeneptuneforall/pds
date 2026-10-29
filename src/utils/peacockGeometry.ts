import * as THREE from 'three';
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import { clamp, smoothstep } from './geometry';

/** Tail train layout: longest row furthest back. */
export const TRAIN_ROWS = [
{ count: 25, length: 1.3, depth: -0.03, elevOffset: 0 },
{ count: 21, length: 1.05, depth: -0.015, elevOffset: 0.05 },
{ count: 17, length: 0.8, depth: 0, elevOffset: 0.1 }];

export const TRAIN_ROOT = new THREE.Vector3(0, 0.58, -0.22);
export const TRAIN_COUNT = TRAIN_ROWS.reduce((n, r) => n + r.count, 0);

export function hash(n: number) {
  const s = Math.sin(n * 127.1 + 311.7) * 43758.5453;
  return s - Math.floor(s);
}

/** Unit-length feather vane along +Y (scaled per instance by feather length). */
export function createVaneGeometry() {
  const width = (y: number) => 0.003 + 0.034 * Math.pow(Math.sin(Math.PI * clamp((y - 0.08) / 0.92, 0, 1)), 0.6);
  const shape = new THREE.Shape();
  const steps = 18;
  shape.moveTo(0, 0);
  for (let i = 0; i <= steps; i++) {
    const y = i / steps;
    shape.lineTo(width(y), y);
  }
  for (let i = steps; i >= 0; i--) {
    const y = i / steps;
    shape.lineTo(-width(y), y);
  }
  const g = new THREE.ShapeGeometry(shape, 1);
  const pos = g.getAttribute('position') as THREE.BufferAttribute;
  const shaft = new THREE.Color('#cbb98a');
  const bronze = new THREE.Color('#6e6326');
  const green = new THREE.Color('#2e7d4f');
  const c = new THREE.Color();
  const colors: number[] = [];
  for (let i = 0; i < pos.count; i++) {
    const y = pos.getY(i);
    if (y < 0.09) c.copy(shaft);else
    c.copy(bronze).lerp(green, smoothstep(0.1, 0.8, y));
    colors.push(c.r, c.g, c.b);
  }
  g.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
  return g;
}

function ellipseLayer(rx: number, ry: number, cy: number, z: number, color: string) {
  const shape = new THREE.Shape();
  shape.absellipse(0, cy, rx, ry, 0, Math.PI * 2, false, 0);
  const g = new THREE.ShapeGeometry(shape, 32);
  g.translate(0, 0, z);
  const col = new THREE.Color(color);
  const count = g.getAttribute('position').count;
  const colors = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    colors[i * 3] = col.r;
    colors[i * 3 + 1] = col.g;
    colors[i * 3 + 2] = col.b;
  }
  g.setAttribute('color', new THREE.BufferAttribute(colors, 3));
  return g;
}

/** Concentric eye-spot rings merged into one geometry for instancing. */
export function createEyeGeometry() {
  const layers = [
  ellipseLayer(0.06, 0.075, 0, 0, '#b88a2e'),
  ellipseLayer(0.05, 0.064, -0.002, 0.0008, '#1f8a5a'),
  ellipseLayer(0.036, 0.047, -0.005, 0.0016, '#1a6f8a'),
  ellipseLayer(0.022, 0.029, -0.009, 0.0024, '#12225e')];

  const merged = mergeGeometries(layers, false);
  layers.forEach((l) => l.dispose());
  return merged ?? new THREE.BufferGeometry();
}