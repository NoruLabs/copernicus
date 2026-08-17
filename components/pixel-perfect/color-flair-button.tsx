"use client";

import { type ReactNode, useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

gsap.registerPlugin(useGSAP);

const FLAIRS = [
  { color: "#A5A6F6", size: "210%" }, // purple
  { color: "#7BD88F", size: "158%" }, // green
  { color: "#FFD36E", size: "112%" }, // yellow
  { color: "#FF9BB3", size: "70%" }, // coral
];

const ColorFlairButton = ({
  href,
  label,
  children,
  className = "",
}: {
  href: string;
  label: string;
  children: ReactNode;
  className?: string;
}) => {
  const buttonRef = useRef<HTMLAnchorElement>(null);

  useGSAP(
    () => {
      const button = buttonRef.current;
      if (!button) return;

      const flairs = Array.from(
        button.querySelectorAll<HTMLElement>(".flair"),
      );

      gsap.set(flairs, { xPercent: -50, yPercent: -50, scale: 0 });
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        return;
      }

      const move = flairs.map((f, i) => {
        const duration = 0.65 - i * 0.12; // 0.65 → 0.29 across the stack
        return {
          x: gsap.quickTo(f, "x", { duration, ease: "power3" }),
          y: gsap.quickTo(f, "y", { duration, ease: "power3" }),
          xSet: gsap.quickSetter(f, "x", "px"),
          ySet: gsap.quickSetter(f, "y", "px"),
        };
      });

      const getXY = (e: MouseEvent) => {
        const { left, top } = button.getBoundingClientRect();
        return { x: e.clientX - left, y: e.clientY - top };
      };

      const onEnter = (e: MouseEvent) => {
        const { x, y } = getXY(e);
        move.forEach((m) => {
          m.xSet(x); // teleport every circle to the entry point...
          m.ySet(y);
        });
        gsap.to(flairs, {
          scale: 1,
          duration: 0.4,
          ease: "power3.out",
          stagger: 0.08,
          overwrite: "auto",
        });
      };

      const onMove = (e: MouseEvent) => {
        const { x, y } = getXY(e);
        move.forEach((m) => {
          m.x(x);
          m.y(y);
        });
      };

      const onLeave = (e: MouseEvent) => {
        const { x, y } = getXY(e);
        move.forEach((m) => {
          m.x(x);
          m.y(y);
        });
        gsap.to(flairs, {
          scale: 0,
          duration: 0.35,
          ease: "power3.out",
          stagger: { each: 0.07, from: "end" },
          overwrite: "auto",
        });
      };

      button.addEventListener("mouseenter", onEnter);
      button.addEventListener("mousemove", onMove);
      button.addEventListener("mouseleave", onLeave);

      return () => {
        button.removeEventListener("mouseenter", onEnter);
        button.removeEventListener("mousemove", onMove);
        button.removeEventListener("mouseleave", onLeave);
      };
    },
    { scope: buttonRef },
  );

  return (
    <a
      aria-label={label}
      className={`color-flair-button ${className}`}
      href={href}
      ref={buttonRef}
      title={label}
    >
      {FLAIRS.map((flair) => (
        <span
          className="flair"
          key={flair.color}
          style={{ width: flair.size, backgroundColor: flair.color }}
        />
      ))}
      <span className="color-flair-content">{children}</span>
    </a>
  );
};

export default ColorFlairButton;
