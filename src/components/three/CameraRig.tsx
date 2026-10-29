import { useMemo, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { anchorFallbacks, cameraWaypoints, heroIntro } from '../../data/cameraWaypoints';
import { cinematicState, sceneAnchors } from '../../utils/cinematicState';
import { clamp, lerp } from '../../utils/geometry';
import type { CameraWaypoint } from '../../types/cinematic';

/**
 * Reads cinematicState.cam (written by the GSAP timeline) and places the camera.
 * Targets are resolved from live anchor world positions, interpolated in spherical
 * coordinates so the camera arcs around the character instead of cutting through it.
 * The up vector is fixed, so there is never accidental roll.
 */
export function CameraRig({ reducedMotion }: {reducedMotion: boolean;}) {
  const { camera, size } = useThree();
  const initialized = useRef(false);
  const v = useMemo(
    () => ({
      a: new THREE.Vector3(),
      b: new THREE.Vector3(),
      target: new THREE.Vector3(),
      desired: new THREE.Vector3(),
      smoothTarget: new THREE.Vector3()
    }),
    []
  );

  useFrame((_, delta) => {
    const cam = camera as THREE.PerspectiveCamera;
    const s = cinematicState;
    const n = cameraWaypoints.length;
    const c = clamp(s.cam, 0, n - 1);
    const i = Math.min(Math.floor(c), n - 2);
    const t = c - i;
    const A = cameraWaypoints[i];
    const B = cameraWaypoints[i + 1];

    resolveAnchor(A, v.a);
    resolveAnchor(B, v.b);
    v.target.lerpVectors(v.a, v.b, t);

    const aspect = size.width / Math.max(size.height, 1);
    const compact = size.width < 1024 || aspect < 1;
    const portraitMix = compact ? clamp((1.3 - aspect) / 0.85, 0, 1) : 0;

    const distA = i === 0 ? lerp(heroIntro.startDistance, A.distance, s.intro) : A.distance;
    const sxA = i === 0 ? A.screenX * s.intro : A.screenX;
    const dist =
    lerp(distA, B.distance, t) * lerp(lerp(1, A.portraitDistance, portraitMix), lerp(1, B.portraitDistance, portraitMix), t);
    const az = lerp(A.azimuth, B.azimuth, t);
    const el = lerp(A.elevation, B.elevation, t);
    const sx = compact ? 0 : lerp(sxA, B.screenX, t);
    const sy = compact ? lerp(A.portraitScreenY, B.portraitScreenY, t) : lerp(A.screenY, B.screenY, t);

    v.desired.
    set(Math.sin(az) * Math.cos(el), Math.sin(el), Math.cos(az) * Math.cos(el)).
    multiplyScalar(dist).
    add(v.target);

    const k = reducedMotion || !initialized.current ? 1 : 1 - Math.exp(-delta * 10);
    cam.position.lerp(v.desired, k);
    v.smoothTarget.lerp(v.target, k);
    initialized.current = true;

    cam.up.set(0, 1, 0);
    cam.lookAt(v.smoothTarget);
    cam.fov = lerp(A.fov, B.fov, t);
    cam.setViewOffset(size.width, size.height, -sx * size.width, sy * size.height, size.width, size.height);
    cam.updateProjectionMatrix();
  });

  return null;
}

function resolveAnchor(wp: CameraWaypoint, out: THREE.Vector3) {
  if (Array.isArray(wp.anchor)) {
    out.set(wp.anchor[0], wp.anchor[1], wp.anchor[2]);
  } else {
    const obj = sceneAnchors[wp.anchor];
    if (obj) obj.getWorldPosition(out);else
    out.set(...anchorFallbacks[wp.anchor]);
  }
  return out.add(new THREE.Vector3(...wp.offset));
}