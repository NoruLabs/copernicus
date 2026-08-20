"use client";

import dynamic from "next/dynamic";
import type { ComponentProps, ReactNode } from "react";

const ObjectStageRoot = dynamic(
  () => import("./ObjectStage").then((module) => module.ObjectStageRoot),
  { ssr: false },
);

const NeoObjectStage = dynamic(
  () => import("./ObjectStage").then((module) => module.NeoObjectStage),
  { ssr: false },
);

const PlanetObjectStage = dynamic(
  () => import("./ObjectStage").then((module) => module.PlanetObjectStage),
  { ssr: false },
);

export function NeoIllustrationRoot({ children }: { children: ReactNode }) {
  return <ObjectStageRoot>{children}</ObjectStageRoot>;
}

export function PlanetIllustrationRoot({ children }: { children: ReactNode }) {
  return <ObjectStageRoot>{children}</ObjectStageRoot>;
}

export function NeoIllustration(
  props: ComponentProps<typeof NeoObjectStage>,
) {
  return <NeoObjectStage {...props} />;
}

export function PlanetIllustration(
  props: ComponentProps<typeof PlanetObjectStage>,
) {
  return <PlanetObjectStage {...props} />;
}
