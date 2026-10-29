import React, { useEffect, useMemo, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { cinematicState } from '../../utils/cinematicState';
import { getMaterials } from '../../utils/materials';

/** Warm key, soft fill, gold/teal rim lights and a studio environment for the gold reflections. */
export function LightingRig() {
  const { gl, scene } = useThree();
  const hemi = useRef<THREE.HemisphereLight>(null);
  const key = useRef<THREE.DirectionalLight>(null);
  const fill = useRef<THREE.DirectionalLight>(null);
  const rim = useRef<THREE.DirectionalLight>(null);
  const rim2 = useRef<THREE.DirectionalLight>(null);
  const colors = useMemo(() => ({ gold: new THREE.Color('#ffcf7a'), teal: new THREE.Color('#5fd6c6') }), []);

  useEffect(() => {
    const pmrem = new THREE.PMREMGenerator(gl);
    const env = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
    scene.environment = env;
    return () => {
      scene.environment = null;
      env.dispose();
      pmrem.dispose();
    };
  }, [gl, scene]);

  useFrame(() => {
    const s = cinematicState;
    const r = s.reveal;
    if (hemi.current) hemi.current.intensity = 0.04 + 0.5 * r * s.fill;
    if (key.current) key.current.intensity = 2.6 * r * s.key;
    if (fill.current) fill.current.intensity = 0.75 * r * s.fill;
    if (rim.current) {
      rim.current.intensity = (0.9 + 1.3 * r) * s.rim;
      rim.current.color.copy(colors.gold).lerp(colors.teal, s.teal);
    }
    if (rim2.current) rim2.current.intensity = (0.3 + 0.9 * r) * s.rim;
    scene.environmentIntensity = 0.06 + 0.74 * r;
    getMaterials().skin.emissiveIntensity = 0.16 * r;
  });

  return (
    <>
      <hemisphereLight ref={hemi} args={['#fff1dc', '#3a2418', 0]} />
      <directionalLight ref={key} position={[3.5, 5, 5]} color="#ffe4bd" intensity={0} />
      <directionalLight ref={fill} position={[-4, 2, 3]} color="#ffd9c4" intensity={0} />
      <directionalLight ref={rim} position={[-2.5, 4, -5]} intensity={0} />
      <directionalLight ref={rim2} position={[3, 3.5, -4]} color="#ffd48a" intensity={0} />
    </>);

}