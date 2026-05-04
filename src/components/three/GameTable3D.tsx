"use client";

import { OrbitControls, Text } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import { useEffect, useMemo, useRef, useState } from "react";
import type { Mesh } from "three";
import {
  CatmullRomCurve3,
  DoubleSide,
  LatheGeometry,
  MathUtils,
  Shape,
  Vector2,
  Vector3,
} from "three";
import type { BoardState, Move, Player, Point } from "@/game";

type Source = number | "bar";

type GameTable3DProps = {
  state: BoardState;
  availableMoves: Move[];
  selectedSource: Source | null;
  targetMoves: Move[];
  onSelectSource: (source: Source) => void;
  onSelectTarget: (target: number | "off") => void;
};

type PointPosition = {
  index: number;
  row: "top" | "bottom";
  col: number;
  x: number;
  z: number;
  direction: 1 | -1;
};

const BOARD_WIDTH = 10.7;
const BOARD_DEPTH = 5.75;
const POINT_STEP = 0.82;

function pointPosition(index: number): PointPosition {
  if (index >= 12) {
    const col = index - 12;
    return {
      index,
      row: "top",
      col,
      x: (col - 5.5) * POINT_STEP,
      z: -1.86,
      direction: 1,
    };
  }

  const col = 11 - index;
  return {
    index,
    row: "bottom",
    col,
    x: (col - 5.5) * POINT_STEP,
    z: 1.86,
    direction: -1,
  };
}

function pieceOffsets(count: number): Array<[number, number, number]> {
  const visible = Math.min(count, 6);
  return Array.from({ length: visible }, (_, index) => {
    const lane = index % 3;
    const tier = Math.floor(index / 3);
    return [(lane - 1) * 0.16, tier * 0.34, index * 0.11];
  });
}

function VasePiece({
  owner,
  position,
  selected,
  active,
}: {
  owner: Player;
  position: [number, number, number];
  selected: boolean;
  active: boolean;
}) {
  const ref = useRef<Mesh>(null);
  const geometry = useMemo(() => {
    const profile = [
      new Vector2(0.24, 0),
      new Vector2(0.32, 0.08),
      new Vector2(0.42, 0.32),
      new Vector2(0.36, 0.6),
      new Vector2(0.2, 0.84),
      new Vector2(0.17, 1.18),
      new Vector2(0.22, 1.38),
      new Vector2(0.34, 1.48),
      new Vector2(0.28, 1.58),
      new Vector2(0.08, 1.62),
    ];
    return new LatheGeometry(profile, 40);
  }, []);

  useFrame(({ clock }) => {
    if (!ref.current) return;
    const t = clock.getElapsedTime();
    ref.current.position.y = position[1] + (active ? Math.sin(t * 3.2) * 0.035 : 0);
    ref.current.rotation.y = Math.sin(t * 0.7 + position[0]) * 0.08;
  });

  return (
    <group position={position}>
      <mesh
        ref={ref}
        castShadow
        receiveShadow
        geometry={geometry}
        scale={selected ? 1.12 : 1}
      >
        <meshPhysicalMaterial
          color={owner === "white" ? "#fff1cd" : "#050505"}
          roughness={0.19}
          metalness={0.02}
          clearcoat={1}
          clearcoatRoughness={0.08}
          emissive={active ? "#2d1c06" : "#000000"}
          emissiveIntensity={active ? 0.18 : 0}
        />
      </mesh>
      <mesh
        position={[0, 0.03, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
        receiveShadow
      >
        <circleGeometry args={[0.34, 36]} />
        <meshStandardMaterial color="#070504" transparent opacity={0.38} />
      </mesh>
    </group>
  );
}

function BoardPoint3D({
  point,
  position,
  isSource,
  isTarget,
  canSelect,
  onSelectSource,
  onSelectTarget,
}: {
  point: Point;
  position: PointPosition;
  isSource: boolean;
  isTarget: boolean;
  canSelect: boolean;
  onSelectSource: () => void;
  onSelectTarget: () => void;
}) {
  const owner = point.owner;
  const color = position.index % 2 === 0 ? "#8c2f25" : "#20100d";
  const interactionColor = isTarget ? "#4ade80" : isSource ? "#facc15" : color;
  const length = 2.48;
  const triangle = useMemo(
    () =>
      new Shape([
        new Vector2(-0.36, 0),
        new Vector2(0.36, 0),
        new Vector2(0, position.direction * -length),
      ]),
    [position.direction],
  );

  const handleClick = () => {
    if (isTarget) {
      onSelectTarget();
      return;
    }
    if (canSelect) onSelectSource();
  };

  return (
    <group position={[position.x, 0.05, position.z]}>
      <mesh
        receiveShadow
        rotation={[-Math.PI / 2, 0, 0]}
        onClick={(event) => {
          event.stopPropagation();
          handleClick();
        }}
      >
        <shapeGeometry args={[triangle]} />
        <meshStandardMaterial
          color={interactionColor}
          roughness={0.48}
          metalness={0.05}
          side={DoubleSide}
          emissive={isTarget || isSource || canSelect ? interactionColor : "#000000"}
          emissiveIntensity={isTarget ? 0.55 : isSource || canSelect ? 0.22 : 0}
        />
      </mesh>
      <Text
        position={[0, 0.075, position.direction * 0.28]}
        rotation={[-Math.PI / 2, 0, 0]}
        fontSize={0.16}
        color="#f7dc9a"
        anchorX="center"
        anchorY="middle"
      >
        {position.index}
      </Text>
      {owner
        ? pieceOffsets(point.count).map(([x, y, depth], pieceIndex) => (
            <VasePiece
              key={pieceIndex}
              owner={owner}
              selected={isSource}
              active={isTarget || canSelect || isSource}
              position={[
                x,
                0.13 + y,
                position.direction * (0.28 + depth),
              ]}
            />
          ))
        : null}
      {point.count > 6 ? (
        <Text
          position={[0.3, 1.25, position.direction * 0.86]}
          rotation={[-0.75, 0, 0]}
          fontSize={0.18}
          color="#fff4c2"
          anchorX="center"
        >
          x{point.count}
        </Text>
      ) : null}
    </group>
  );
}

function Pip({ x, z }: { x: number; z: number }) {
  return (
    <mesh position={[x, 0.261, z]} rotation={[-Math.PI / 2, 0, 0]}>
      <circleGeometry args={[0.048, 18]} />
      <meshStandardMaterial color="#16100d" />
    </mesh>
  );
}

function DiceCube({
  value,
  position,
  rollKey,
}: {
  value: number | "-";
  position: [number, number, number];
  rollKey: string;
}) {
  const ref = useRef<Mesh>(null);
  const [rollingUntil, setRollingUntil] = useState(0);
  const pips: Record<number, Array<[number, number]>> = {
    1: [[0, 0]],
    2: [
      [-0.12, -0.12],
      [0.12, 0.12],
    ],
    3: [
      [-0.13, -0.13],
      [0, 0],
      [0.13, 0.13],
    ],
    4: [
      [-0.13, -0.13],
      [0.13, -0.13],
      [-0.13, 0.13],
      [0.13, 0.13],
    ],
    5: [
      [-0.13, -0.13],
      [0.13, -0.13],
      [0, 0],
      [-0.13, 0.13],
      [0.13, 0.13],
    ],
    6: [
      [-0.13, -0.15],
      [0.13, -0.15],
      [-0.13, 0],
      [0.13, 0],
      [-0.13, 0.15],
      [0.13, 0.15],
    ],
  };

  useEffect(() => {
    setRollingUntil(performance.now() + 760);
  }, [rollKey]);

  useFrame(() => {
    if (!ref.current) return;
    const rolling = performance.now() < rollingUntil;
    if (rolling) {
      ref.current.rotation.x += 0.19;
      ref.current.rotation.y += 0.14;
      ref.current.rotation.z += 0.11;
      ref.current.position.y = position[1] + Math.sin(performance.now() * 0.018) * 0.08;
      return;
    }
    ref.current.rotation.x = MathUtils.lerp(ref.current.rotation.x, 0, 0.12);
    ref.current.rotation.y = MathUtils.lerp(ref.current.rotation.y, 0, 0.12);
    ref.current.rotation.z = MathUtils.lerp(ref.current.rotation.z, 0, 0.12);
    ref.current.position.y = MathUtils.lerp(ref.current.position.y, position[1], 0.16);
  });

  return (
    <mesh ref={ref} castShadow receiveShadow position={position}>
      <boxGeometry args={[0.52, 0.52, 0.52]} />
      <meshPhysicalMaterial
        color="#f8dd99"
        roughness={0.28}
        clearcoat={0.72}
        clearcoatRoughness={0.18}
      />
      {typeof value === "number"
        ? pips[value].map(([x, z], index) => <Pip key={index} x={x} z={z} />)
        : null}
    </mesh>
  );
}

function Spectator({
  position,
  color,
}: {
  position: [number, number, number];
  color: string;
}) {
  const ref = useRef<Mesh>(null);
  useFrame(({ clock }) => {
    if (!ref.current) return;
    ref.current.position.y = position[1] + Math.sin(clock.getElapsedTime() * 1.2 + position[0]) * 0.025;
  });

  return (
    <group position={position}>
      <mesh castShadow position={[0, 0.55, 0]}>
        <sphereGeometry args={[0.22, 28, 18]} />
        <meshStandardMaterial color="#d5b07d" roughness={0.55} />
      </mesh>
      <mesh ref={ref} castShadow position={[0, 0.08, 0]}>
        <capsuleGeometry args={[0.28, 0.72, 8, 18]} />
        <meshStandardMaterial color={color} roughness={0.68} />
      </mesh>
      <mesh position={[0, -0.34, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.5, 32]} />
        <meshStandardMaterial color="#050403" transparent opacity={0.35} />
      </mesh>
    </group>
  );
}

function Room() {
  return (
    <group>
      <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.08, 0]}>
        <planeGeometry args={[18, 13]} />
        <meshStandardMaterial color="#2a1915" roughness={0.72} />
      </mesh>
      <mesh receiveShadow position={[0, 2.65, -5.35]}>
        <boxGeometry args={[18, 5.4, 0.18]} />
        <meshStandardMaterial color="#1d1211" roughness={0.8} />
      </mesh>
      <mesh receiveShadow position={[-8.1, 2.15, 0]} rotation={[0, Math.PI / 2, 0]}>
        <boxGeometry args={[11, 4.5, 0.18]} />
        <meshStandardMaterial color="#241411" roughness={0.82} />
      </mesh>
      <mesh receiveShadow position={[8.1, 2.15, 0]} rotation={[0, Math.PI / 2, 0]}>
        <boxGeometry args={[11, 4.5, 0.18]} />
        <meshStandardMaterial color="#1a1010" roughness={0.84} />
      </mesh>
      <Text
        position={[0, 2.05, -5.18]}
        fontSize={0.48}
        color="#a97937"
        anchorX="center"
        anchorY="middle"
      >
        宣和雅局
      </Text>
      <mesh position={[0, 2.72, -4.82]}>
        <boxGeometry args={[4.6, 0.08, 0.08]} />
        <meshStandardMaterial color="#8a5a22" metalness={0.2} roughness={0.32} />
      </mesh>
    </group>
  );
}

function TableSurface({
  state,
  availableMoves,
  selectedSource,
  targetMoves,
  onSelectSource,
  onSelectTarget,
}: GameTable3DProps) {
  const targetPoints = useMemo(
    () =>
      new Set(
        targetMoves
          .filter((move) => typeof move.to === "number")
          .map((move) => move.to as number),
      ),
    [targetMoves],
  );
  const sourcePoints = useMemo(
    () => new Set(availableMoves.filter((move) => typeof move.from === "number").map((move) => move.from as number)),
    [availableMoves],
  );
  const canSelectBar = availableMoves.some((move) => move.from === "bar");
  const canBearOff = targetMoves.some((move) => move.to === "off");
  const rollKey = state.currentRoll ? state.currentRoll.join("-") : "empty";
  const curve = useMemo(
    () =>
      new CatmullRomCurve3([
        new Vector3(-4.8, 0.08, -2.74),
        new Vector3(0, 0.08, -2.58),
        new Vector3(4.8, 0.08, -2.74),
      ]),
    [],
  );

  return (
    <group position={[0, 0.55, 0]}>
      <mesh castShadow receiveShadow position={[0, -0.16, 0]}>
        <boxGeometry args={[12.2, 0.38, 7]} />
        <meshPhysicalMaterial
          color="#250b08"
          roughness={0.36}
          metalness={0.08}
          clearcoat={0.65}
          clearcoatRoughness={0.2}
        />
      </mesh>
      <mesh receiveShadow position={[0, 0.055, 0]}>
        <boxGeometry args={[BOARD_WIDTH, 0.09, BOARD_DEPTH]} />
        <meshStandardMaterial color="#090706" roughness={0.58} metalness={0.04} />
      </mesh>
      <mesh position={[0, 0.12, 0]}>
        <boxGeometry args={[0.08, 0.06, BOARD_DEPTH]} />
        <meshStandardMaterial color="#b06b24" roughness={0.26} metalness={0.45} />
      </mesh>
      <mesh position={[-5.6, 0.08, 0]}>
        <boxGeometry args={[0.12, 0.13, BOARD_DEPTH + 0.35]} />
        <meshStandardMaterial color="#6d2b13" roughness={0.35} metalness={0.18} />
      </mesh>
      <mesh position={[5.6, 0.08, 0]}>
        <boxGeometry args={[0.12, 0.13, BOARD_DEPTH + 0.35]} />
        <meshStandardMaterial color="#6d2b13" roughness={0.35} metalness={0.18} />
      </mesh>
      <mesh>
        <tubeGeometry args={[curve, 36, 0.025, 8]} />
        <meshStandardMaterial color="#c59245" metalness={0.35} roughness={0.22} />
      </mesh>

      {state.points.map((point, index) => {
        const position = pointPosition(index);
        return (
          <BoardPoint3D
            key={index}
            point={point}
            position={position}
            isSource={selectedSource === index}
            isTarget={targetPoints.has(index)}
            canSelect={sourcePoints.has(index)}
            onSelectSource={() => onSelectSource(index)}
            onSelectTarget={() => onSelectTarget(index)}
          />
        );
      })}

      <group position={[-5.15, 0.22, 0]}>
        <mesh
          castShadow
          receiveShadow
          onClick={(event) => {
            event.stopPropagation();
            if (canSelectBar) onSelectSource("bar");
          }}
        >
          <boxGeometry args={[0.56, 0.18, 1.62]} />
          <meshStandardMaterial
            color={canSelectBar ? "#2f5d3a" : "#120908"}
            emissive={canSelectBar ? "#14532d" : "#000000"}
            emissiveIntensity={canSelectBar ? 0.34 : 0}
          />
        </mesh>
        <Text position={[0, 0.18, 0]} rotation={[-Math.PI / 2, 0, Math.PI / 2]} fontSize={0.17} color="#f5df9c">
          马栏 {state.bar.white}/{state.bar.black}
        </Text>
      </group>

      <group position={[5.15, 0.22, 0]}>
        <mesh
          castShadow
          receiveShadow
          onClick={(event) => {
            event.stopPropagation();
            if (canBearOff) onSelectTarget("off");
          }}
        >
          <boxGeometry args={[0.56, 0.18, 1.62]} />
          <meshStandardMaterial
            color={canBearOff ? "#7c4f12" : "#120908"}
            emissive={canBearOff ? "#713f12" : "#000000"}
            emissiveIntensity={canBearOff ? 0.34 : 0}
          />
        </mesh>
        <Text position={[0, 0.18, 0]} rotation={[-Math.PI / 2, 0, -Math.PI / 2]} fontSize={0.17} color="#f5df9c">
          出马 {state.borneOff.white}/{state.borneOff.black}
        </Text>
      </group>

      <DiceCube
        value={state.currentRoll?.[0] ?? "-"}
        position={[-0.42, 0.56, 0]}
        rollKey={`${rollKey}-0`}
      />
      <DiceCube
        value={state.currentRoll?.[1] ?? "-"}
        position={[0.42, 0.56, 0.08]}
        rollKey={`${rollKey}-1`}
      />
    </group>
  );
}

function Scene(props: GameTable3DProps) {
  return (
    <>
      <color attach="background" args={["#090706"]} />
      <fog attach="fog" args={["#090706", 9, 18]} />
      <ambientLight intensity={0.82} />
      <directionalLight
        castShadow
        position={[3.8, 6.2, 3.2]}
        intensity={2.4}
        shadow-mapSize={[2048, 2048]}
      />
      <pointLight position={[-3.2, 2.6, -2.3]} color="#f5b65a" intensity={1.35} />
      <pointLight position={[3.1, 2.8, 2.1]} color="#c95c43" intensity={0.75} />
      <Room />
      <TableSurface {...props} />
      <Spectator position={[-4.9, 0.3, -3.2]} color="#5d1d18" />
      <Spectator position={[4.9, 0.3, -3.2]} color="#1d2738" />
      <Spectator position={[-5.35, 0.3, 2.6]} color="#3b2418" />
      <Spectator position={[5.35, 0.3, 2.6]} color="#412431" />
      <OrbitControls
        enablePan={false}
        minDistance={7.4}
        maxDistance={12.5}
        minPolarAngle={0.66}
        maxPolarAngle={1.22}
        target={[0, 0.55, 0]}
      />
    </>
  );
}

export function GameTable3D(props: GameTable3DProps) {
  return (
    <section className="game-3d-shell">
      <div className="game-3d-canvas">
        <Canvas
          camera={{ position: [0, 6.2, 8.4], fov: 42 }}
          dpr={[1, 1.7]}
          shadows
        >
          <Scene {...props} />
        </Canvas>
      </div>
    </section>
  );
}
