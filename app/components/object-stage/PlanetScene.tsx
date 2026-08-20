"use client";

import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import type { Group } from "three";
import {
  bodyGeometry,
  orbitRingGeometry,
  starGeometry,
} from "./geometries";

export type PlanetSceneProps = {
  active: boolean;
  radiusEarth: number | null;
  temperatureK: number | null;
  orbitalPeriodDays: number | null;
  distancePc: number | null;
  reducedMotion: boolean;
};

function planetScale(radiusEarth: number | null) {
  if (radiusEarth == null || !Number.isFinite(radiusEarth)) return 0.22;
  return Math.min(0.48, Math.max(0.1, 0.1 + Math.log10(radiusEarth + 1) * 0.28));
}

function orbitRadius(orbitalPeriodDays: number | null, distancePc: number | null) {
  const period = orbitalPeriodDays ?? 30;
  const far = distancePc != null ? Math.min(0.35, Math.log10(distancePc + 1) * 0.12) : 0;
  return Math.min(2.2, Math.max(1.05, 0.85 + Math.log10(period + 1) * 0.45 + far));
}

function planetTone(temperatureK: number | null) {
  if (temperatureK == null || !Number.isFinite(temperatureK)) return "#8d949c";
  if (temperatureK < 200) return "#7f8fa3";
  if (temperatureK < 350) return "#8f9a8c";
  if (temperatureK < 700) return "#a89880";
  if (temperatureK < 1200) return "#b4876d";
  return "#c77a64";
}

function orbitSpeed(orbitalPeriodDays: number | null) {
  if (orbitalPeriodDays == null || !Number.isFinite(orbitalPeriodDays)) return 0.4;
  return Math.min(0.9, Math.max(0.12, 12 / Math.sqrt(orbitalPeriodDays + 4)));
}

export function PlanetScene({
  active,
  radiusEarth,
  temperatureK,
  orbitalPeriodDays,
  distancePc,
  reducedMotion,
}: PlanetSceneProps) {
  const root = useRef<Group>(null);
  const planet = useRef<Group>(null);
  const radius = orbitRadius(orbitalPeriodDays, distancePc);
  const speed = orbitSpeed(orbitalPeriodDays);
  const size = planetScale(radiusEarth);
  const color = planetTone(temperatureK);

  const seed = useMemo(
    () =>
      ((radiusEarth ?? 1) * 7 +
        (temperatureK ?? 300) * 0.01 +
        (orbitalPeriodDays ?? 10) * 0.03) %
      (Math.PI * 2),
    [orbitalPeriodDays, radiusEarth, temperatureK],
  );

  useFrame((state, delta) => {
    if (!active || !planet.current || !root.current) return;
    root.current.rotation.y += reducedMotion ? 0 : delta * 0.06;
    const t = reducedMotion
      ? seed
      : state.clock.elapsedTime * speed + seed;
    planet.current.position.set(
      Math.cos(t) * radius,
      Math.sin(t * 0.4) * 0.18,
      Math.sin(t) * radius * 0.7,
    );
    planet.current.rotation.y += reducedMotion ? 0 : delta * 0.7;
  });

  return (
    <group ref={root}>
      <mesh geometry={starGeometry} scale={0.42}>
        <meshBasicMaterial color="#f2efe6" />
      </mesh>
      <mesh geometry={starGeometry} scale={0.58}>
        <meshBasicMaterial color="#d9d4c8" transparent opacity={0.22} />
      </mesh>
      <mesh
        geometry={orbitRingGeometry}
        rotation={[Math.PI / 2.35, -0.15, 0.1]}
        scale={radius}
      >
        <meshBasicMaterial color="#6a6a6a" transparent opacity={0.5} />
      </mesh>
      <group ref={planet}>
        <mesh geometry={bodyGeometry} scale={size}>
          <meshBasicMaterial color={color} />
        </mesh>
      </group>
    </group>
  );
}
