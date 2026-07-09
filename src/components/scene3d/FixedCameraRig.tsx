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
    camera.position.set(0, compact ? 6.95 : 4.85, compact ? 10.25 : 10.75);
    camera.fov = compact ? 46 : 38;
    camera.near = 0.1;
    camera.far = 40;
    camera.lookAt(0, compact ? 0.86 : 1.34, compact ? -0.62 : -1.18);
    camera.updateProjectionMatrix();
  }, [camera, size.height, size.width]);

  return null;
}
