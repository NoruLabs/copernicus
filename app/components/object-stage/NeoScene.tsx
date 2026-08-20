"use client";

import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import type { Group } from "three";
import {
  bodyGeometry,
  earthGeometry,
  orbitRingGeometry,
} from "./geometries";

export type NeoSceneProps = {
  active: boolean;
  hazardous: boolean;
  diameterKm: number | null;
  missDistanceKm: number | null;
  velocityKms: number | null;
  orbitClass: string | null;
  reducedMotion: boolean;
};

function asteroidScale(diameterKm: number | null) {
  if (diameterKm == null || !Number.isFinite(diameterKm)) return 0.08;
  return Math.min(0.22, Math.max(0.05, 0.04 + Math.log10(diameterKm * 1000 + 1) * 0.04));
}

function approachRadius(missDistanceKm: number | null, orbitClass: string | null) {
  const classBias =
    orbitClass === "Aten"
      ? 1.35
      : orbitClass === "Apollo"
        ? 1.85
        : orbitClass === "Amor"
          ? 2.25
          : orbitClass === "Atira"
            ? 1.15
            : 1.9;
  if (missDistanceKm == null || !Number.isFinite(missDistanceKm)) return classBias;
  const lunar = missDistanceKm / 384_400;
  return Math.min(2.55, Math.max(1.2, 1.15 + Math.log10(lunar + 1) * 0.55));
}

function orbitSpeed(velocityKms: number | null) {
  if (velocityKms == null || !Number.isFinite(velocityKms)) return 0.35;
  return Math.min(0.85, Math.max(0.18, velocityKms / 40));
}

export function NeoScene({
  active,
  hazardous,
  diameterKm,
  missDistanceKm,
  velocityKms,
  orbitClass,
  reducedMotion,
}: NeoSceneProps) {
  const root = useRef<Group>(null);
  const rock = useRef<Group>(null);
  const radius = approachRadius(missDistanceKm, orbitClass);
  const speed = orbitSpeed(velocityKms);
  const rockSize = asteroidScale(diameterKm);
  const rockColor = hazardous ? "#d8d8d8" : "#9a9a9a";
  const pathColor = hazardous ? "#ececec" : "#6f6f6f";

  const seed = useMemo(
    () =>
      ((diameterKm ?? 0.1) * 13 +
        (missDistanceKm ?? 1e6) * 0.000001 +
        (velocityKms ?? 10)) %
      (Math.PI * 2),
    [diameterKm, missDistanceKm, velocityKms],
  );

  useFrame((state, delta) => {
    if (!active || !rock.current || !root.current) return;
    root.current.rotation.y += reducedMotion ? 0 : delta * 0.08;
    const t = reducedMotion
      ? seed
      : state.clock.elapsedTime * speed + seed;
    rock.current.position.set(
      Math.cos(t) * radius,
      Math.sin(t * 0.35) * 0.22,
      Math.sin(t) * radius * 0.72,
    );
    rock.current.rotation.x += reducedMotion ? 0 : delta * 1.4;
    rock.current.rotation.z += reducedMotion ? 0 : delta * 0.9;
  });

  return (
    <group ref={root}>
      <mesh geometry={earthGeometry} scale={0.72}>
        <meshBasicMaterial color="#4d6a84" />
      </mesh>
      <mesh geometry={earthGeometry} scale={0.735}>
        <meshBasicMaterial color="#7f93a5" transparent opacity={0.28} />
      </mesh>
      <mesh
        geometry={orbitRingGeometry}
        rotation={[Math.PI / 2.4, 0.2, 0.15]}
        scale={radius}
      >
        <meshBasicMaterial color={pathColor} transparent opacity={0.55} />
      </mesh>
      <group ref={rock}>
        <mesh geometry={bodyGeometry} scale={rockSize}>
          <meshBasicMaterial color={rockColor} />
        </mesh>
      </group>
    </group>
  );
}
