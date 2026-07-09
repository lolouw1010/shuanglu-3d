"use client";

import { DoubleSide } from "three";

function ScreenPanel({ x }: { x: number }) {
  return (
    <group position={[x, 2.42, -5.18]}>
      <mesh receiveShadow>
        <boxGeometry args={[2.52, 4.16, 0.09]} />
        <meshStandardMaterial color="#4c3828" roughness={0.86} />
      </mesh>
      <mesh position={[0, 0, 0.056]}>
        <planeGeometry args={[2.22, 3.58]} />
        <meshStandardMaterial color="#8a7350" roughness={0.94} side={DoubleSide} />
      </mesh>
      <mesh position={[-0.34, -0.26, 0.063]} rotation={[0, 0, -0.24]}>
        <boxGeometry args={[0.035, 2.12, 0.018]} />
        <meshStandardMaterial color="#4c382a" roughness={0.92} transparent opacity={0.58} />
      </mesh>
      <mesh position={[0.38, -0.08, 0.064]} rotation={[0, 0, 0.22]}>
        <boxGeometry args={[0.03, 1.58, 0.018]} />
        <meshStandardMaterial color="#5a4331" roughness={0.92} transparent opacity={0.52} />
      </mesh>
      <mesh position={[0.1, -0.92, 0.065]} rotation={[0, 0, -0.58]}>
        <boxGeometry args={[1.06, 0.03, 0.018]} />
        <meshStandardMaterial color="#5a4331" roughness={0.92} transparent opacity={0.46} />
      </mesh>
      <mesh position={[-0.1, -1.16, 0.066]} rotation={[0, 0, -0.1]}>
        <boxGeometry args={[1.38, 0.026, 0.018]} />
        <meshStandardMaterial color="#6a513b" roughness={0.92} transparent opacity={0.34} />
      </mesh>
      {[0.74, 0.96, 1.16].map((y, index) => (
        <mesh key={y} position={[-0.52 + index * 0.32, y, 0.068]} rotation={[0, 0, -0.18 + index * 0.15]}>
          <circleGeometry args={[0.055, 14]} />
          <meshStandardMaterial
            color={index === 1 ? "#8f5d51" : "#b78772"}
            roughness={0.72}
            emissive="#31120f"
            emissiveIntensity={0.08}
          />
        </mesh>
      ))}
    </group>
  );
}

function WindowLattice({ x, z, rotationY }: { x: number; z: number; rotationY: number }) {
  return (
    <group position={[x, 2.85, z]} rotation={[0, rotationY, 0]}>
      <mesh>
        <boxGeometry args={[2.1, 2.42, 0.08]} />
        <meshStandardMaterial color="#130d0b" roughness={0.72} />
      </mesh>
      <mesh position={[0, 0, 0.052]}>
        <planeGeometry args={[1.78, 2.08]} />
        <meshStandardMaterial
          color="#18201d"
          emissive="#20342e"
          emissiveIntensity={0.18}
          roughness={0.88}
          side={DoubleSide}
        />
      </mesh>
      {[-0.58, 0, 0.58].map((barX) => (
        <mesh key={`v-${barX}`} position={[barX, 0, 0.096]}>
          <boxGeometry args={[0.045, 2.15, 0.045]} />
          <meshStandardMaterial color="#7b5230" roughness={0.42} />
        </mesh>
      ))}
      {[-0.64, 0, 0.64].map((barY) => (
        <mesh key={`h-${barY}`} position={[0, barY, 0.1]}>
          <boxGeometry args={[1.85, 0.045, 0.045]} />
          <meshStandardMaterial color="#7b5230" roughness={0.42} />
        </mesh>
      ))}
    </group>
  );
}

function ScrollRoll({ x, z, rotationY = 0 }: { x: number; z: number; rotationY?: number }) {
  return (
    <group position={[x, 0.54, z]} rotation={[0, rotationY, Math.PI / 2]}>
      <mesh castShadow>
        <cylinderGeometry args={[0.12, 0.12, 1.2, 24]} />
        <meshStandardMaterial color="#c4aa78" roughness={0.58} />
      </mesh>
      <mesh position={[0, 0.66, 0]} castShadow>
        <cylinderGeometry args={[0.05, 0.05, 0.12, 16]} />
        <meshStandardMaterial color="#5d3923" roughness={0.5} />
      </mesh>
      <mesh position={[0, -0.66, 0]} castShadow>
        <cylinderGeometry args={[0.05, 0.05, 0.12, 16]} />
        <meshStandardMaterial color="#5d3923" roughness={0.5} />
      </mesh>
    </group>
  );
}

function BlossomVase() {
  return (
    <group position={[2.95, 0.82, -4.25]}>
      <mesh castShadow>
        <cylinderGeometry args={[0.28, 0.38, 0.92, 24]} />
        <meshStandardMaterial color="#2b211b" roughness={0.48} metalness={0.18} />
      </mesh>
      {[-0.45, -0.18, 0.12, 0.36].map((x, index) => (
        <group key={x} rotation={[0, 0, -0.34 + index * 0.22]}>
          <mesh position={[x, 0.74 + index * 0.18, 0]} rotation={[0, 0, -0.32]}>
            <boxGeometry args={[0.025, 1.2, 0.025]} />
            <meshStandardMaterial color="#5b3828" roughness={0.64} />
          </mesh>
          <mesh position={[x * 1.25, 1.36 + index * 0.15, 0.04]}>
            <sphereGeometry args={[0.085, 14, 10]} />
            <meshStandardMaterial color="#b78372" roughness={0.66} emissive="#3b1715" emissiveIntensity={0.1} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

export function RoomEnvironment() {
  return (
    <group>
      <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.08, 0]}>
        <planeGeometry args={[18, 13]} />
        <meshStandardMaterial color="#1c120f" roughness={0.82} />
      </mesh>
      <mesh receiveShadow position={[0, 0.08, 0.52]}>
        <boxGeometry args={[15.6, 0.38, 9.2]} />
        <meshStandardMaterial
          color="#2b160f"
          roughness={0.46}
          metalness={0.04}
        />
      </mesh>
      <mesh receiveShadow position={[0, 0.32, 4.82]}>
        <boxGeometry args={[16.1, 0.68, 0.36]} />
        <meshStandardMaterial color="#3a170f" roughness={0.36} metalness={0.08} />
      </mesh>
      {[-5.8, -2.9, 0, 2.9, 5.8].map((x) => (
        <mesh key={`plank-${x}`} position={[x, 0.286, 0.52]}>
          <boxGeometry args={[0.035, 0.035, 8.55]} />
          <meshStandardMaterial color="#5d2c19" roughness={0.5} metalness={0.08} />
        </mesh>
      ))}
      <mesh receiveShadow position={[0, 2.45, -5.28]}>
        <boxGeometry args={[15.5, 5.1, 0.18]} />
        <meshStandardMaterial color="#2a1d19" roughness={0.88} />
      </mesh>
      {[-5.55, -2.78, 0, 2.78, 5.55].map((x) => (
        <mesh key={x} position={[x, 2.45, -5.1]}>
          <boxGeometry args={[0.055, 4.2, 0.09]} />
          <meshStandardMaterial color="#76502a" metalness={0.12} roughness={0.38} />
        </mesh>
      ))}
      {[-4.16, -1.38, 1.38, 4.16].map((x) => (
        <ScreenPanel key={x} x={x} />
      ))}
      <WindowLattice x={-6.75} z={-4.02} rotationY={0.34} />
      <WindowLattice x={6.75} z={-4.02} rotationY={-0.34} />
      <mesh position={[-2.75, 0.92, -4.15]} castShadow>
        <boxGeometry args={[1.2, 1.68, 1.0]} />
        <meshStandardMaterial color="#24130e" roughness={0.7} />
      </mesh>
      <mesh position={[-2.75, 1.92, -4.15]}>
        <boxGeometry args={[0.92, 0.9, 0.72]} />
        <meshStandardMaterial
          color="#e2a756"
          emissive="#d88b35"
          emissiveIntensity={0.86}
          transparent
          opacity={0.82}
          roughness={0.45}
        />
      </mesh>
      <pointLight position={[-2.75, 1.96, -3.62]} color="#f4ad55" intensity={2.65} distance={8.8} />
      <BlossomVase />
      <mesh position={[4.78, 0.62, -4.3]} castShadow receiveShadow>
        <boxGeometry args={[2.05, 0.28, 0.72]} />
        <meshStandardMaterial color="#2a1711" roughness={0.58} metalness={0.06} />
      </mesh>
      <ScrollRoll x={4.35} z={-4.14} rotationY={0.08} />
      <ScrollRoll x={5.0} z={-4.02} rotationY={-0.12} />
      <mesh position={[-5.95, 0.66, 2.7]} castShadow>
        <cylinderGeometry args={[0.18, 0.22, 1.02, 24]} />
        <meshStandardMaterial color="#23140f" roughness={0.52} metalness={0.18} />
      </mesh>
      <mesh position={[-5.95, 1.34, 2.7]} castShadow>
        <cylinderGeometry args={[0.34, 0.12, 0.78, 28]} />
        <meshStandardMaterial color="#4e2618" roughness={0.42} metalness={0.12} />
      </mesh>
      <mesh position={[0, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[6.8, 8.8, 72]} />
        <meshBasicMaterial color="#000000" transparent opacity={0.24} side={DoubleSide} />
      </mesh>
    </group>
  );
}
