"use client";

import { useThree } from "@react-three/fiber";
import { useLayoutEffect } from "react";
import { PerspectiveCamera } from "three";

export function FixedCameraRig() {
  const camera = useThree((state) => state.camera);
  const size = useThree((state) => state.size);

  useLayoutEffect(() => {
    if (!(camera instanceof PerspectiveCamera)) return;

    const compact = size.width / Math.max(size.height, 1) < 1.2;
    camera.position.set(0, compact ? 7.35 : 5.35, compact ? 10.7 : 11.3);
    camera.fov = compact ? 45 : 35;
    camera.near = 0.1;
    camera.far = 40;
    camera.lookAt(0, compact ? 0.72 : 1.18, compact ? -0.45 : -0.72);
    camera.updateProjectionMatrix();
  }, [camera, size.height, size.width]);

  return null;
}
