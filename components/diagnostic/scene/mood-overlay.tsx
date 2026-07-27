"use client";

import { motion } from "framer-motion";
import type { Palette } from "@/lib/diagnostic/scene";

/**
 * Lavagem de cor do mood sobre a sala. mix-blend soft-light deixa a luz
 * "pintar" a parede sem apagar o SVG. Cor + opacidade animadas (~0.8s).
 */
export function MoodOverlay({ palette }: { palette: Palette }) {
  return (
    <motion.div
      className="absolute inset-0"
      style={{ mixBlendMode: "soft-light" }}
      initial={false}
      animate={{ backgroundColor: palette.overlay, opacity: palette.overlayOpacity }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    />
  );
}