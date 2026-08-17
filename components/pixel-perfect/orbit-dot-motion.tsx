"use client";

import { motion, useReducedMotion } from "framer-motion";

const OrbitDotMotion = () => {
  const reduceMotion = useReducedMotion();

  return (
    <div
      aria-hidden="true"
      className="orbit-motion"
      style={{ perspective: "900px", transformStyle: "preserve-3d" }}
    >
      <div className="orbit-motion-core" />

      <motion.div
        className="orbit-motion-dot"
        initial={{
          transform:
            "translate(-50%, -50%) rotateY(0deg) translateZ(8px) rotateY(360deg)",
        }}
        animate={
          reduceMotion
            ? undefined
            : {
                transform:
                  "translate(-50%, -50%) rotateY(360deg) translateZ(8px) rotateY(0deg)",
              }
        }
        transition={{ duration: 3, ease: "linear", repeat: Infinity }}
      />
    </div>
  );
};

export default OrbitDotMotion;
