"use client";

import { useTexture } from "@react-three/drei";
import { DoubleSide, SRGBColorSpace, Texture } from "three";

function CharacterActor({
  texture,
  position,
  rotationY,
  active,
}: {
  texture: Texture;
  position: [number, number, number];
  rotationY: number;
  active: boolean;
}) {
  return (
    <group position={position} rotation={[0, rotationY, 0]}>
      <mesh position={[0, -1.48, -0.08]} receiveShadow>
        <boxGeometry args={[2.35, 0.28, 1.12]} />
        <meshStandardMaterial color="#31201a" roughness={0.82} />
      </mesh>
      <mesh position={[0, 0, 0]} castShadow>
        <planeGeometry args={[2.55, 3.62]} />
        <meshBasicMaterial
          map={texture}
          transparent
          alphaTest={0.08}
          color={active ? "#fff5df" : "#b8a58d"}
          toneMapped={false}
          side={DoubleSide}
        />
      </mesh>
      <pointLight
        position={[0, 0.45, 1.1]}
        color={active ? "#ffd89a" : "#9d7654"}
        intensity={active ? 1.15 : 0.32}
        distance={4.2}
      />
    </group>
  );
}

export function CharacterActors({ currentPlayer }: { currentPlayer: "white" | "black" }) {
  const [whiteTexture, blackTexture] = useTexture([
    "/assets/characters/li-qingzhao-halfbody.png",
    "/assets/characters/song-emperor-halfbody.png",
  ]);

  whiteTexture.colorSpace = SRGBColorSpace;
  blackTexture.colorSpace = SRGBColorSpace;

  return (
    <group>
      <CharacterActor
        texture={whiteTexture}
        position={[-4.28, 2.05, -4.2]}
        rotationY={0.08}
        active={currentPlayer === "white"}
      />
      <CharacterActor
        texture={blackTexture}
        position={[4.28, 2.05, -4.2]}
        rotationY={-0.08}
        active={currentPlayer === "black"}
      />
    </group>
  );
}
