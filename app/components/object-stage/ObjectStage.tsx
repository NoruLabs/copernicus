"use client";

import { PerspectiveCamera, View } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { motion, useReducedMotion } from "framer-motion";
import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
  type RefObject,
} from "react";
import type { NeoRecord, PlanetRecord } from "../../lib/archive";
import { NeoScene } from "./NeoScene";
import { PlanetScene } from "./PlanetScene";

type StageContextValue = {
  eventSource: RefObject<HTMLElement | null>;
};

const StageContext = createContext<StageContextValue | null>(null);

function usePrefersReducedMotion() {
  const framer = useReducedMotion();
  const [fallback, setFallback] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setFallback(media.matches);
    sync();
    media.addEventListener("change", sync);
    return () => media.removeEventListener("change", sync);
  }, []);

  return Boolean(framer || fallback);
}

function useStageActive(root: RefObject<HTMLElement | null>) {
  const [active, setActive] = useState(false);

  useEffect(() => {
    const node = root.current;
    if (!node) return;

    const syncVisibility = () => {
      setActive(!document.hidden && node.getBoundingClientRect().height > 0);
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        setActive(!document.hidden && entry.isIntersecting);
      },
      { rootMargin: "120px 0px", threshold: 0.05 },
    );
    observer.observe(node);
    const onVisibility = () => syncVisibility();
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [root]);

  return active;
}

export function ObjectStageRoot({ children }: { children: ReactNode }) {
  const eventSource = useRef<HTMLElement | null>(null);
  const value = useMemo(() => ({ eventSource }), []);
  const [frameloop, setFrameloop] = useState<"always" | "never">("always");

  useEffect(() => {
    const sync = () => setFrameloop(document.hidden ? "never" : "always");
    sync();
    document.addEventListener("visibilitychange", sync);
    return () => document.removeEventListener("visibilitychange", sync);
  }, []);

  return (
    <StageContext.Provider value={value}>
      <div
        className="object-stage-root"
        ref={eventSource as RefObject<HTMLDivElement>}
      >
        {children}
        <Canvas
          className="object-stage-canvas"
          dpr={[1, 1.5]}
          eventPrefix="client"
          eventSource={eventSource as unknown as RefObject<HTMLElement>}
          frameloop={frameloop}
          gl={{
            antialias: false,
            alpha: false,
            powerPreference: "high-performance",
            stencil: false,
            depth: true,
          }}
          style={{ pointerEvents: "none" }}
        >
          <color attach="background" args={["#050505"]} />
          <View.Port />
        </Canvas>
      </div>
    </StageContext.Provider>
  );
}

function StageShell({
  label,
  children,
}: {
  label: string;
  children: (state: { active: boolean; reducedMotion: boolean }) => ReactNode;
}) {
  const shellRef = useRef<HTMLDivElement>(null);
  const reducedMotion = usePrefersReducedMotion();
  const active = useStageActive(shellRef);

  return (
    <motion.div
      aria-hidden="true"
      className="object-stage"
      initial={reducedMotion ? false : { opacity: 0.35, filter: "blur(6px)" }}
      ref={shellRef}
      transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
      viewport={{ once: true, amount: 0.35 }}
      whileInView={reducedMotion ? undefined : { opacity: 1, filter: "blur(0px)" }}
    >
      <span className="sr-only">{label}</span>
      <View className="object-stage-view" visible={active}>
        <PerspectiveCamera makeDefault fov={36} position={[0, 0.55, 4.2]} />
        {children({ active, reducedMotion })}
      </View>
    </motion.div>
  );
}

export function NeoObjectStage({ item }: { item: NeoRecord }) {
  const context = useContext(StageContext);
  if (!context) return null;

  const diameter =
    item.estimatedDiameterMinKm != null && item.estimatedDiameterMaxKm != null
      ? (item.estimatedDiameterMinKm + item.estimatedDiameterMaxKm) / 2
      : (item.estimatedDiameterMaxKm ?? item.estimatedDiameterMinKm);

  return (
    <StageShell label={`Illustration of near-Earth object ${item.name}`}>
      {({ active, reducedMotion }) => (
        <NeoScene
          active={active}
          diameterKm={diameter}
          hazardous={item.hazardous}
          missDistanceKm={item.missDistanceKm}
          orbitClass={item.orbitClass}
          reducedMotion={reducedMotion}
          velocityKms={item.velocityKms}
        />
      )}
    </StageShell>
  );
}

export function PlanetObjectStage({ item }: { item: PlanetRecord }) {
  const context = useContext(StageContext);
  if (!context) return null;

  return (
    <StageShell label={`Illustration of exoplanet ${item.name}`}>
      {({ active, reducedMotion }) => (
        <PlanetScene
          active={active}
          distancePc={item.distancePc}
          orbitalPeriodDays={item.orbitalPeriodDays}
          radiusEarth={item.radiusEarth}
          reducedMotion={reducedMotion}
          temperatureK={item.temperatureK}
        />
      )}
    </StageShell>
  );
}
