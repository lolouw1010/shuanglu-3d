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
    camera.position.set(compact ? 0 : -0.28, compact ? 6.55 : 3.92, compact ? 9.75 : 9.05);
    camera.fov = compact ? 45 : 42;
    camera.near = 0.1;
    camera.far = 40;
    camera.lookAt(0.18, compact ? 0.92 : 1.08, compact ? -0.72 : -1.18);
    camera.updateProjectionMatrix();
  }, [camera, size.height, size.width]);

  return null;
}
