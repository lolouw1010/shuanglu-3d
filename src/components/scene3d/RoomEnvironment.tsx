"use client";

import { DoubleSide } from "three";

export function RoomEnvironment() {
  return (
    <group>
      <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.08, 0]}>
        <planeGeometry args={[18, 13]} />
        <meshStandardMaterial color="#211511" roughness={0.82} />
      </mesh>
      <mesh receiveShadow position={[0, 2.45, -5.28]}>
        <boxGeometry args={[15.5, 5.1, 0.18]} />
        <meshStandardMaterial color="#2a1d19" roughness={0.88} />
      </mesh>
      {[-5.4, -2.7, 0, 2.7, 5.4].map((x) => (
        <mesh key={x} position={[x, 2.45, -5.16]}>
          <boxGeometry args={[0.055, 4.2, 0.09]} />
          <meshStandardMaterial color="#76502a" metalness={0.12} roughness={0.38} />
        </mesh>
      ))}
      <mesh position={[0, 2.5, -5.05]}>
        <planeGeometry args={[10.6, 3.8]} />
        <meshStandardMaterial color="#6f5b41" roughness={0.96} side={DoubleSide} />
      </mesh>
      <mesh position={[0, 1.18, -3.9]} castShadow>
        <boxGeometry args={[0.82, 2.1, 0.82]} />
        <meshStandardMaterial color="#2b1812" roughness={0.72} />
      </mesh>
      <mesh position={[0, 2.28, -3.9]}>
        <boxGeometry args={[0.68, 0.88, 0.68]} />
        <meshStandardMaterial
          color="#e1a957"
          emissive="#d88b35"
          emissiveIntensity={0.72}
          transparent
          opacity={0.78}
          roughness={0.45}
        />
      </mesh>
      <pointLight position={[0, 2.2, -3.25]} color="#f4ad55" intensity={2.2} distance={8} />
      <mesh position={[0, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[6.1, 8.1, 72]} />
        <meshBasicMaterial color="#000000" transparent opacity={0.3} side={DoubleSide} />
      </mesh>
    </group>
  );
}
