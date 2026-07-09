"use client";

import { useTexture } from "@react-three/drei";
import { DoubleSide, SRGBColorSpace, Texture } from "three";

function CharacterActor({
  texture,
  position,
  rotationY,
  active,
  side,
}: {
  texture: Texture;
  position: [number, number, number];
  rotationY: number;
  active: boolean;
  side: "left" | "right";
}) {
  return (
    <group position={position} rotation={[0, rotationY, 0]}>
      <mesh position={[0, -1.62, -0.16]} receiveShadow>
        <boxGeometry args={[2.9, 0.34, 1.18]} />
        <meshStandardMaterial color="#2b1913" roughness={0.78} />
      </mesh>
      <mesh position={[side === "left" ? -0.14 : 0.14, -0.18, -0.18]} rotation={[0, 0, side === "left" ? -0.05 : 0.05]}>
        <planeGeometry args={[3.35, 4.35]} />
        <meshBasicMaterial
          color="#140b08"
          transparent
          opacity={0.34}
          side={DoubleSide}
        />
      </mesh>
      <mesh position={[0, 0, 0]} castShadow>
        <planeGeometry args={[3.12, 4.42]} />
        <meshBasicMaterial
          map={texture}
          transparent
          alphaTest={0.08}
          color={active ? "#fff7e8" : "#d2bfa3"}
          toneMapped={false}
          side={DoubleSide}
        />
      </mesh>
      <mesh position={[side === "left" ? 0.72 : -0.72, -1.08, 0.28]} rotation={[0.08, 0, side === "left" ? -0.3 : 0.3]}>
        <boxGeometry args={[1.25, 0.2, 0.18]} />
        <meshStandardMaterial color="#3a2118" roughness={0.62} metalness={0.04} />
      </mesh>
      <mesh position={[0, -1.76, 0.18]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <circleGeometry args={[1.36, 36]} />
        <meshBasicMaterial color="#000000" transparent opacity={0.3} />
      </mesh>
      <pointLight
        position={[side === "left" ? 0.5 : -0.5, 0.48, 1.15]}
        color={active ? "#ffd28d" : "#c59061"}
        intensity={active ? 1.05 : 0.48}
        distance={4.6}
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
        position={[-4.45, 2.42, -3.58]}
        rotationY={0.14}
        active={currentPlayer === "white"}
        side="left"
      />
      <CharacterActor
        texture={blackTexture}
        position={[4.45, 2.42, -3.58]}
        rotationY={-0.14}
        active={currentPlayer === "black"}
        side="right"
      />
    </group>
  );
}
