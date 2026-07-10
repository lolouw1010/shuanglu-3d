"use client";

import { ContactShadows, RoundedBox, useTexture } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import { useEffect, useMemo, useRef, useState } from "react";
import { DoubleSide, LatheGeometry, SRGBColorSpace, Shape, Vector2 } from "three";
import type { Group } from "three";
import type { BoardState, Move, MoveRecord, Player, Point } from "@/game";
import { FixedCameraRig } from "@/components/scene3d/FixedCameraRig";

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

const BOARD_WIDTH = 11.35;
const BOARD_DEPTH = 6.15;
const POINT_STEP = 0.76;
const POINT_LENGTH = 2.34;
const PIECE_SCALE = 0.245;
const SELECTED_PIECE_SCALE = 0.285;
const MOVE_ANIMATION_SECONDS = 0.68;

type PresentedMove = {
  historyLength: number;
  move: MoveRecord;
};

function pointPosition(index: number): PointPosition {
  if (index >= 12) {
    const col = index - 12;
    return {
      index,
      row: "top",
      col,
      x: (col - 5.5) * POINT_STEP,
      z: -2.28,
      direction: 1,
    };
  }

  const col = 11 - index;
  return {
    index,
    row: "bottom",
    col,
    x: (col - 5.5) * POINT_STEP,
    z: 2.28,
    direction: -1,
  };
}

function pieceOffsets(count: number): Array<[number, number, number]> {
  const visible = Math.min(count, 7);
  return Array.from({ length: visible }, (_, index) => {
    const lane = index % 2;
    const row = Math.floor(index / 2);
    return [(lane - 0.5) * 0.18, row * 0.008, row * 0.28 + lane * 0.04];
  });
}

function pointPiecePosition(index: number, count: number): [number, number, number] {
  const point = pointPosition(index);
  const offsets = pieceOffsets(Math.max(1, count));
  const [x, y, depth] = offsets.at(-1) ?? [0, 0, 0];

  return [
    point.x + x,
    0.18 + y,
    point.z + point.direction * (0.16 + depth),
  ];
}

function usePresentedMove(state: BoardState): PresentedMove | null {
  const previousHistoryLength = useRef(state.moveHistory.length);
  const [presentedMove, setPresentedMove] = useState<PresentedMove | null>(null);

  useEffect(() => {
    const historyLength = state.moveHistory.length;
    const delta = historyLength - previousHistoryLength.current;
    previousHistoryLength.current = historyLength;

    const latest = state.moveHistory.at(-1);
    if (
      delta !== 1 ||
      !latest ||
      typeof latest.from !== "number" ||
      typeof latest.to !== "number"
    ) {
      setPresentedMove(null);
      return undefined;
    }

    const next = { historyLength, move: latest };
    setPresentedMove(next);
    const timer = window.setTimeout(() => {
      setPresentedMove((current) =>
        current?.historyLength === historyLength ? null : current,
      );
    }, MOVE_ANIMATION_SECONDS * 1000);

    return () => window.clearTimeout(timer);
  }, [state, state.moveHistory.length]);

  return presentedMove;
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
  const geometry = useMemo(() => {
    const profile = [
      new Vector2(0.14, 0),
      new Vector2(0.24, 0.05),
      new Vector2(0.31, 0.16),
      new Vector2(0.39, 0.48),
      new Vector2(0.35, 0.78),
      new Vector2(0.24, 1.02),
      new Vector2(0.13, 1.22),
      new Vector2(0.13, 1.58),
      new Vector2(0.2, 1.78),
      new Vector2(0.31, 1.86),
      new Vector2(0.25, 1.96),
      new Vector2(0.08, 2.0),
    ];
    return new LatheGeometry(profile, 40);
  }, []);

  const isWhite = owner === "white";
  const bodyColor = isWhite ? "#fff0c5" : "#030303";
  const rimColor = "#d6a34d";
  const highlightColor = isWhite ? "#fff9e8" : "#e6ddd1";

  return (
    <group position={position} scale={selected ? SELECTED_PIECE_SCALE : PIECE_SCALE}>
      <mesh castShadow receiveShadow geometry={geometry}>
        <meshPhysicalMaterial
          color={bodyColor}
          roughness={isWhite ? 0.16 : 0.11}
          metalness={0.01}
          clearcoat={1}
          clearcoatRoughness={0.05}
          emissive={active ? "#4b2a08" : "#000000"}
          emissiveIntensity={active ? 0.2 : 0}
          reflectivity={0.72}
        />
      </mesh>
      <mesh castShadow position={[0, 0.035, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.21, 0.035, 12, 44]} />
        <meshStandardMaterial color={rimColor} roughness={0.18} metalness={0.45} />
      </mesh>
      <mesh castShadow position={[0, 1.94, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.24, 0.032, 12, 48]} />
        <meshPhysicalMaterial
          color={rimColor}
          roughness={0.16}
          metalness={0.42}
          clearcoat={1}
          clearcoatRoughness={0.04}
        />
      </mesh>
      <mesh position={[-0.19, 1.0, 0.22]} rotation={[0.16, -0.2, -0.18]}>
        <boxGeometry args={[0.026, 0.68, 0.01]} />
        <meshBasicMaterial color={highlightColor} transparent opacity={isWhite ? 0.5 : 0.7} />
      </mesh>
      <mesh position={[-0.06, 1.66, 0.24]} rotation={[0.1, 0, -0.1]}>
        <boxGeometry args={[0.02, 0.26, 0.01]} />
        <meshBasicMaterial color={highlightColor} transparent opacity={0.62} />
      </mesh>
      <mesh position={[0, 0.018, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <circleGeometry args={[0.34, 42]} />
        <meshStandardMaterial color="#020101" transparent opacity={0.32} />
      </mesh>
    </group>
  );
}

function AnimatedMovePiece({
  state,
  presentedMove,
}: {
  state: BoardState;
  presentedMove: PresentedMove;
}) {
  const group = useRef<Group>(null);
  const elapsed = useRef(0);
  const { move } = presentedMove;
  const from = move.from as number;
  const to = move.to as number;
  const start = useMemo(
    () => pointPiecePosition(from, state.points[from].count + 1),
    [from, state.points],
  );
  const end = useMemo(
    () => pointPiecePosition(to, state.points[to].count),
    [state.points, to],
  );

  useFrame((_, delta) => {
    if (!group.current) return;
    elapsed.current = Math.min(MOVE_ANIMATION_SECONDS, elapsed.current + delta);
    const progress = elapsed.current / MOVE_ANIMATION_SECONDS;
    const eased = progress * progress * (3 - 2 * progress);

    group.current.position.set(
      start[0] + (end[0] - start[0]) * eased,
      start[1] + (end[1] - start[1]) * eased + Math.sin(Math.PI * progress) * 0.82,
      start[2] + (end[2] - start[2]) * eased,
    );
    group.current.rotation.y = Math.sin(Math.PI * progress) * 0.22;
  });

  return (
    <group ref={group} position={start}>
      <VasePiece
        owner={move.player}
        selected={false}
        active
        position={[0, 0, 0]}
      />
    </group>
  );
}

function TrayPieces({
  owner,
  count,
  center,
}: {
  owner: Player;
  count: number;
  center: [number, number, number];
}) {
  const visible = Math.min(count, 6);

  return (
    <group position={center}>
      {Array.from({ length: visible }, (_, index) => {
        const lane = index % 2;
        const row = Math.floor(index / 2);
        return (
          <VasePiece
            key={`${owner}-${index}`}
            owner={owner}
            selected={false}
            active={false}
            position={[(lane - 0.5) * 0.16, row * 0.095, (row - 1) * 0.25]}
          />
        );
      })}
      {count > visible ? (
        <mesh position={[0, 0.72, 0]}>
          <sphereGeometry args={[0.08, 18, 12]} />
          <meshStandardMaterial color="#e6bd70" emissive="#5d3208" emissiveIntensity={0.3} />
        </mesh>
      ) : null}
    </group>
  );
}

function BoardPoint3D({
  point,
  position,
  isSource,
  isTarget,
  canSelect,
  hideTopPiece,
  onSelectSource,
  onSelectTarget,
}: {
  point: Point;
  position: PointPosition;
  isSource: boolean;
  isTarget: boolean;
  canSelect: boolean;
  hideTopPiece: boolean;
  onSelectSource: () => void;
  onSelectTarget: () => void;
}) {
  const triangle = useMemo(
    () =>
      new Shape([
        new Vector2(-0.32, 0),
        new Vector2(0.32, 0),
        new Vector2(0, position.direction * -POINT_LENGTH),
      ]),
    [position.direction],
  );
  const baseColor = position.index % 2 === 0 ? "#d0a25a" : "#21100b";
  const activeColor = isTarget ? "#74d8a4" : isSource ? "#f4d16a" : canSelect ? "#d5b15d" : baseColor;
  const laneOpacity = isTarget ? 0.48 : isSource || canSelect ? 0.26 : 0;
  const pipOpacity = isTarget ? 0.86 : isSource || canSelect ? 0.56 : 0;

  const handleClick = () => {
    if (isTarget) {
      onSelectTarget();
      return;
    }
    if (canSelect) onSelectSource();
  };

  return (
    <group
      position={[position.x, 0.148, position.z]}
      onClick={(event) => {
        event.stopPropagation();
        handleClick();
      }}
    >
      <mesh
        receiveShadow
        rotation={[-Math.PI / 2, 0, 0]}
      >
        <shapeGeometry args={[triangle]} />
        <meshStandardMaterial
          color={activeColor}
          emissive={isTarget || isSource || canSelect ? activeColor : "#120804"}
          emissiveIntensity={isTarget ? 0.36 : isSource || canSelect ? 0.16 : 0.06}
          metalness={0.3}
          roughness={0.36}
          side={DoubleSide}
          transparent
          opacity={laneOpacity}
        />
      </mesh>
      <mesh
        position={[0, 0.018, position.direction * -POINT_LENGTH * 0.48]}
        rotation={[-Math.PI / 2, 0, 0]}
      >
        <circleGeometry args={[0.055, 18]} />
        <meshStandardMaterial
          color={isTarget ? "#c9ffe2" : "#e2b35a"}
          emissive={isTarget ? "#2f8f5e" : "#5c3508"}
          emissiveIntensity={isTarget ? 0.45 : 0.18}
          metalness={0.35}
          roughness={0.25}
          transparent
          opacity={pipOpacity}
        />
      </mesh>
      {point.owner
        ? pieceOffsets(point.count).map(([x, y, depth], pieceIndex, offsets) =>
            hideTopPiece && pieceIndex === offsets.length - 1 ? null : (
              <VasePiece
                key={pieceIndex}
                owner={point.owner as Player}
                selected={isSource}
                active={isTarget || canSelect || isSource}
                position={[
                  x,
                  0.03 + y,
                  position.direction * (0.16 + depth),
                ]}
              />
            ),
          )
        : null}
      {point.count > 7 ? (
        <mesh position={[0.2, 0.63, position.direction * 0.54]}>
          <sphereGeometry args={[0.065, 20, 12]} />
          <meshStandardMaterial
            color="#f3d589"
            emissive="#6e3f08"
            emissiveIntensity={0.28}
            metalness={0.35}
            roughness={0.18}
          />
        </mesh>
      ) : null}
    </group>
  );
}

function Pip({ x, z, size }: { x: number; z: number; size: number }) {
  return (
    <mesh position={[x, size / 2 + 0.003, z]} rotation={[-Math.PI / 2, 0, 0]}>
      <circleGeometry args={[size * 0.075, 18]} />
      <meshStandardMaterial color="#24140d" roughness={0.32} />
    </mesh>
  );
}

function DiceCube({
  value,
  position,
  rotation,
  size = 0.38,
}: {
  value: number | "-";
  position: [number, number, number];
  rotation: [number, number, number];
  size?: number;
}) {
  const pipNear = size * 0.24;
  const pipFar = size * 0.27;
  const pips: Record<number, Array<[number, number]>> = {
    1: [[0, 0]],
    2: [
      [-pipNear, -pipNear],
      [pipNear, pipNear],
    ],
    3: [
      [-pipNear, -pipNear],
      [0, 0],
      [pipNear, pipNear],
    ],
    4: [
      [-pipNear, -pipNear],
      [pipNear, -pipNear],
      [-pipNear, pipNear],
      [pipNear, pipNear],
    ],
    5: [
      [-pipNear, -pipNear],
      [pipNear, -pipNear],
      [0, 0],
      [-pipNear, pipNear],
      [pipNear, pipNear],
    ],
    6: [
      [-pipNear, -pipFar],
      [pipNear, -pipFar],
      [-pipNear, 0],
      [pipNear, 0],
      [-pipNear, pipFar],
      [pipNear, pipFar],
    ],
  };

  return (
    <group position={position} rotation={rotation}>
      <RoundedBox
        args={[size, size, size]}
        castShadow
        receiveShadow
        radius={size * 0.12}
        smoothness={4}
      >
        <meshPhysicalMaterial
          color="#f3d393"
          roughness={0.22}
          clearcoat={0.86}
          clearcoatRoughness={0.12}
        />
      </RoundedBox>
      {typeof value === "number"
        ? pips[value].map(([x, z], index) => (
            <Pip key={index} x={x} z={z} size={size} />
          ))
        : null}
    </group>
  );
}

function LacquerBoard({
  state,
  availableMoves,
  selectedSource,
  targetMoves,
  onSelectSource,
  onSelectTarget,
  presentedMove,
}: GameTable3DProps & { presentedMove: PresentedMove | null }) {
  const boardTexture = useTexture("/ui/board-top-orthographic-cropped.png");
  boardTexture.colorSpace = SRGBColorSpace;
  boardTexture.anisotropy = 8;

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
    () =>
      new Set(
        availableMoves
          .filter((move) => typeof move.from === "number")
          .map((move) => move.from as number),
      ),
    [availableMoves],
  );
  const canSelectBar = availableMoves.some((move) => move.from === "bar");
  const canBearOff = targetMoves.some((move) => move.to === "off");

  return (
    <group position={[0.04, 0.12, 0.12]} rotation={[0, -0.035, 0]} scale={[0.7, 0.7, 0.7]}>
      <mesh castShadow receiveShadow position={[0, -0.17, 0]}>
        <boxGeometry args={[12.75, 0.34, 7.45]} />
        <meshPhysicalMaterial
          color="#2c100c"
          roughness={0.3}
          metalness={0.03}
          clearcoat={0.96}
          clearcoatRoughness={0.16}
        />
      </mesh>
      <mesh castShadow receiveShadow position={[0, 0.04, 0]}>
        <boxGeometry args={[12.42, 0.14, 6.18]} />
        <meshPhysicalMaterial
          color="#090505"
          roughness={0.22}
          metalness={0.05}
          clearcoat={1}
          clearcoatRoughness={0.1}
        />
      </mesh>
      {[[-5.86, -3.28], [5.86, -3.28], [-5.86, 3.28], [5.86, 3.28]].map(([x, z]) => (
        <mesh key={`${x}-${z}`} position={[x, 0.06, z]} rotation={[-Math.PI / 2, 0, 0]}>
          <circleGeometry args={[0.18, 28]} />
          <meshStandardMaterial
            color="#d5a34f"
            emissive="#4f2b08"
            emissiveIntensity={0.16}
            metalness={0.42}
            roughness={0.22}
          />
        </mesh>
      ))}
      <mesh castShadow receiveShadow position={[0, 0.02, 0]}>
        <boxGeometry args={[BOARD_WIDTH, 0.16, BOARD_DEPTH]} />
        <meshPhysicalMaterial
          color="#100706"
          roughness={0.36}
          metalness={0.04}
          clearcoat={0.86}
          clearcoatRoughness={0.18}
        />
      </mesh>
      <mesh castShadow receiveShadow position={[0, 0.166, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[12.16, 6.0]} />
        <meshStandardMaterial
          map={boardTexture}
          color="#fff4df"
          roughness={0.34}
          metalness={0.06}
        />
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
            hideTopPiece={presentedMove?.move.to === index}
            onSelectSource={() => onSelectSource(index)}
            onSelectTarget={() => onSelectTarget(index)}
          />
        );
      })}

      {presentedMove ? (
        <AnimatedMovePiece state={state} presentedMove={presentedMove} />
      ) : null}

      <group position={[-5.05, 0.38, 0]}>
        <mesh
          castShadow
          receiveShadow
          onClick={(event) => {
            event.stopPropagation();
            if (canSelectBar) onSelectSource("bar");
          }}
        >
          <boxGeometry args={[0.56, 0.18, 2.08]} />
          <meshStandardMaterial
            color={canSelectBar ? "#315b3c" : "#140908"}
            emissive={canSelectBar ? "#1a5d32" : "#000000"}
            emissiveIntensity={canSelectBar ? 0.34 : 0}
            metalness={0.12}
            roughness={0.34}
            transparent
            opacity={canSelectBar ? 0.56 : 0}
          />
        </mesh>
        <TrayPieces owner="white" count={state.bar.white} center={[0, 0.16, -0.62]} />
        <TrayPieces owner="black" count={state.bar.black} center={[0, 0.16, 0.62]} />
      </group>

      <group position={[5.05, 0.38, 0]}>
        <mesh
          castShadow
          receiveShadow
          onClick={(event) => {
            event.stopPropagation();
            if (canBearOff) onSelectTarget("off");
          }}
        >
          <boxGeometry args={[0.56, 0.18, 2.08]} />
          <meshStandardMaterial
            color={canBearOff ? "#7b4e16" : "#140908"}
            emissive={canBearOff ? "#7a450e" : "#000000"}
            emissiveIntensity={canBearOff ? 0.34 : 0}
            metalness={0.16}
            roughness={0.3}
            transparent
            opacity={canBearOff ? 0.56 : 0}
          />
        </mesh>
        <TrayPieces owner="white" count={state.borneOff.white} center={[0, 0.16, -0.62]} />
        <TrayPieces owner="black" count={state.borneOff.black} center={[0, 0.16, 0.62]} />
      </group>

      <group position={[-2.78, 0.22, 3.12]} rotation={[0, 0.03, 0]}>
        <mesh receiveShadow position={[0, -0.02, 0]}>
          <boxGeometry args={[0.82, 0.04, 0.52]} />
          <meshStandardMaterial color="#130807" roughness={0.46} metalness={0.08} />
        </mesh>
        <DiceCube
          value={state.currentRoll?.[0] ?? "-"}
          position={[-0.18, 0.18, -0.04]}
          rotation={[0.12, 0.38, -0.08]}
          size={0.28}
        />
        <DiceCube
          value={state.currentRoll?.[1] ?? "-"}
          position={[0.2, 0.18, 0.04]}
          rotation={[-0.06, -0.34, 0.1]}
          size={0.28}
        />
      </group>

      <mesh position={[0, -0.3, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[13.2, 7.9]} />
        <meshBasicMaterial color="#000000" transparent opacity={0.14} />
      </mesh>
    </group>
  );
}

function Scene(props: GameTable3DProps) {
  const presentedMove = usePresentedMove(props.state);

  return (
    <>
      <fog attach="fog" args={["#120907", 11, 23]} />
      <ambientLight intensity={0.42} />
      <hemisphereLight args={["#ffe0a4", "#170806", 0.92]} />
      <directionalLight
        castShadow
        position={[3.9, 7.4, 4.4]}
        intensity={2.55}
        shadow-mapSize={[1024, 1024]}
      />
      <spotLight
        castShadow
        position={[-4.4, 5.4, 3.6]}
        angle={0.52}
        penumbra={0.72}
        intensity={2.35}
        color="#ffd08a"
      />
      <pointLight position={[-4.8, 2.95, 2.9]} color="#f2b35f" intensity={1.65} />
      <pointLight position={[4.2, 2.7, -2.5]} color="#b66a42" intensity={0.96} />
      <FixedCameraRig />
      <LacquerBoard {...props} presentedMove={presentedMove} />
      <ContactShadows
        position={[0, 0.18, 0.3]}
        opacity={0.38}
        scale={10.5}
        blur={2.4}
        far={4.8}
      />
    </>
  );
}

export function GameTable3D(props: GameTable3DProps) {
  return (
    <section className="game-3d-shell" aria-label="三维双陆棋桌测试">
      <div className="game-3d-badge">
        <span>固定机位 · 对弈场景</span>
        <strong>构图基线 08</strong>
      </div>
      <div className="game-3d-canvas">
        <Canvas
          camera={{ position: [-0.28, 3.92, 9.05], fov: 42 }}
          dpr={[1, 1.4]}
          gl={{ alpha: true }}
          shadows="basic"
        >
          <Scene {...props} />
        </Canvas>
      </div>
    </section>
  );
}
