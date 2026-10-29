import React, { useLayoutEffect, useRef } from 'react';
import * as THREE from 'three';

type InstancedSetProps = {
  geometry: THREE.BufferGeometry;
  material: THREE.Material;
  transforms: THREE.Matrix4[];
};

/** Renders repeated ornaments (beads, petals, spikes) as a single instanced draw call. */
export function InstancedSet({ geometry, material, transforms }: InstancedSetProps) {
  const ref = useRef<THREE.InstancedMesh>(null);

  useLayoutEffect(() => {
    const mesh = ref.current;
    if (!mesh) return;
    transforms.forEach((m, i) => mesh.setMatrixAt(i, m));
    mesh.instanceMatrix.needsUpdate = true;
    mesh.computeBoundingSphere();
  }, [transforms]);

  return <instancedMesh ref={ref} args={[geometry, material, transforms.length]} frustumCulled={false} />;
}