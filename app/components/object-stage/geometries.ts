import { IcosahedronGeometry, SphereGeometry, TorusGeometry } from "three";

/** Shared low-poly geometries to avoid per-card allocation. */
export const earthGeometry = new SphereGeometry(1, 24, 16);
export const bodyGeometry = new IcosahedronGeometry(1, 1);
export const starGeometry = new SphereGeometry(1, 16, 12);
export const orbitRingGeometry = new TorusGeometry(1, 0.008, 8, 64);
