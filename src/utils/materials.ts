import * as THREE from 'three';

/** Materials are created once and shared across every mesh. */
function createMaterials() {
  return {
    // Skin — non-metallic, warm, with sheen standing in for subsurface glow
    skin: new THREE.MeshPhysicalMaterial({
      color: '#d4936a',
      roughness: 0.55,
      metalness: 0,
      sheen: 0.5,
      sheenRoughness: 0.6,
      sheenColor: new THREE.Color('#ff9c7a'),
      clearcoat: 0.08,
      clearcoatRoughness: 0.6,
      emissive: new THREE.Color('#4a1a0a'),
      emissiveIntensity: 0,
      envMapIntensity: 0.6
    }),
    skinShadow: new THREE.MeshStandardMaterial({ color: '#8e5236', roughness: 0.7 }),
    lip: new THREE.MeshPhysicalMaterial({ color: '#b25a55', roughness: 0.38, clearcoat: 0.35, clearcoatRoughness: 0.4 }),
    mouthLine: new THREE.MeshStandardMaterial({ color: '#5a2620', roughness: 0.8 }),
    eyeWhite: new THREE.MeshPhysicalMaterial({ color: '#f8f3ea', roughness: 0.2, clearcoat: 1, clearcoatRoughness: 0.1 }),
    iris: new THREE.MeshPhysicalMaterial({ color: '#3a1f10', roughness: 0.15, clearcoat: 1, clearcoatRoughness: 0.05 }),
    pupil: new THREE.MeshPhysicalMaterial({ color: '#0c0705', roughness: 0.1, clearcoat: 1 }),
    glint: new THREE.MeshBasicMaterial({ color: '#ffffff', toneMapped: false }),
    kohl: new THREE.MeshStandardMaterial({ color: '#140c09', roughness: 0.6 }),
    brow: new THREE.MeshStandardMaterial({ color: '#22140e', roughness: 0.8 }),
    hair: new THREE.MeshPhysicalMaterial({
      color: '#1a100c',
      roughness: 0.45,
      sheen: 0.8,
      sheenColor: new THREE.Color('#6b4a3a'),
      side: THREE.DoubleSide
    }),
    vibhuti: new THREE.MeshStandardMaterial({ color: '#f2ede4', roughness: 0.95 }),
    kumkum: new THREE.MeshStandardMaterial({ color: '#b8102a', roughness: 0.55 }),

    // Gold is reserved for crown, jewellery, and the Vel
    gold: new THREE.MeshStandardMaterial({ color: '#d8ae55', metalness: 1, roughness: 0.27, envMapIntensity: 1.1 }),
    goldPolished: new THREE.MeshStandardMaterial({ color: '#e2bc66', metalness: 1, roughness: 0.16, envMapIntensity: 1.3 }),
    goldSoft: new THREE.MeshStandardMaterial({ color: '#c99c45', metalness: 1, roughness: 0.42 }),
    ruby: new THREE.MeshPhysicalMaterial({ color: '#b0102a', roughness: 0.08, metalness: 0.1, clearcoat: 1 }),
    emerald: new THREE.MeshPhysicalMaterial({ color: '#0f7a52', roughness: 0.08, metalness: 0.1, clearcoat: 1 }),
    pearl: new THREE.MeshPhysicalMaterial({ color: '#f3ece0', roughness: 0.25, sheen: 1, clearcoat: 0.8 }),

    // Silks
    silk: new THREE.MeshPhysicalMaterial({
      vertexColors: true,
      roughness: 0.5,
      sheen: 1,
      sheenRoughness: 0.35,
      sheenColor: new THREE.Color('#ffcf8a'),
      side: THREE.DoubleSide
    }),
    silkEmerald: new THREE.MeshPhysicalMaterial({
      color: '#1d6b4d',
      roughness: 0.5,
      sheen: 1,
      sheenRoughness: 0.35,
      sheenColor: new THREE.Color('#7fe0b0')
    }),

    // Pedestal
    stone: new THREE.MeshStandardMaterial({ color: '#e2cfae', roughness: 0.85 }),
    stoneDark: new THREE.MeshStandardMaterial({ color: '#b89d76', roughness: 0.85 }),
    petal: new THREE.MeshPhysicalMaterial({ vertexColors: true, roughness: 0.5, sheen: 0.6, sheenColor: new THREE.Color('#ffd6c8') }),

    // Peacock
    peacockBlue: new THREE.MeshPhysicalMaterial({
      color: '#1b4fa0',
      roughness: 0.32,
      metalness: 0.1,
      iridescence: 1,
      iridescenceIOR: 1.4,
      iridescenceThicknessRange: [200, 600],
      sheen: 0.6,
      sheenColor: new THREE.Color('#3fd0c0'),
      clearcoat: 0.4
    }),
    peacockGreen: new THREE.MeshPhysicalMaterial({
      color: '#2e6e4a',
      roughness: 0.35,
      metalness: 0.15,
      iridescence: 0.8,
      iridescenceIOR: 1.3,
      sheen: 0.5,
      sheenColor: new THREE.Color('#d5c26a')
    }),
    wing: new THREE.MeshPhysicalMaterial({ color: '#8d5a2b', roughness: 0.55, sheen: 0.4, sheenColor: new THREE.Color('#e6c08a') }),
    featherVane: new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.5, metalness: 0.15, side: THREE.DoubleSide }),
    featherEye: new THREE.MeshPhysicalMaterial({
      vertexColors: true,
      roughness: 0.32,
      metalness: 0.2,
      iridescence: 0.7,
      iridescenceIOR: 1.35,
      side: THREE.DoubleSide
    }),
    beak: new THREE.MeshStandardMaterial({ color: '#cbbd9a', roughness: 0.5 }),
    leg: new THREE.MeshStandardMaterial({ color: '#7d6a58', roughness: 0.7 }),
    birdEye: new THREE.MeshPhysicalMaterial({ color: '#0a0a0a', roughness: 0.1, clearcoat: 1 }),
    birdWhite: new THREE.MeshStandardMaterial({ color: '#f4f1ea', roughness: 0.6 })
  };
}

export type MaterialLibrary = ReturnType<typeof createMaterials>;

let library: MaterialLibrary | null = null;

export function getMaterials(): MaterialLibrary {
  if (!library) library = createMaterials();
  return library;
}