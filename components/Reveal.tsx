"use client";

import { motion, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";

// Wrap anything in <Reveal> and it fades up once when it scrolls into view.
// With "reduce motion" on, it renders with no animation at all.
export default function Reveal({
  children,
  delay = 0,
  className,
}: {
  children: ReactNode;
  delay?: number; // seconds, for staggering things one after another
  className?: string;
}) {
  const reduce = useReducedMotion();

  if (reduce) return <div className={className}>{children}</div>;

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.45, ease: "easeOut", delay }}
    >
      {children}
    </motion.div>
  );
}
