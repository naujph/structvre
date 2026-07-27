"use client";

import { motion, AnimatePresence } from "framer-motion";
import { DEVICES, type Device } from "@/lib/diagnostic/scene";

/**
 * Assistente de voz como silhueta estilizada + halo colorido + ondas de som.
 * Formas genéricas (cilindro/tela/puck), sem logos oficiais. Aparece com
 * scale-in e tem pulso + ondas contínuas. null → nada.
 */
export function DeviceLayer({ device }: { device: Device }) {
  return (
    <svg
      className="absolute inset-0 h-full w-full"
      viewBox="0 0 1440 900"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden
    >
      <AnimatePresence mode="wait">
        {device && <DeviceSilhouette key={device} device={device} />}
      </AnimatePresence>
    </svg>
  );
}

function DeviceSilhouette({ device }: { device: Exclude<Device, null> }) {
  const { halo, shape } = DEVICES[device];
  // mesa de apoio, trazida para dentro para não cortar na borda direita
  const cx = 1180;
  const baseY = 760;

  return (
    <motion.g
      initial={{ opacity: 0, scale: 0.78 }}
      animate={{ opacity: 1, scale: 1.12 }}
      exit={{ opacity: 0, scale: 0.78 }}
      transition={{ duration: 0.45, ease: "easeOut" }}
      style={{ transformOrigin: `${cx}px ${baseY}px` }}
    >
      {/* mesa */}
      <rect x={cx - 40} y={baseY} width="80" height="14" rx="3" fill="#1b2536" />
      <rect x={cx - 36} y={baseY + 14} width="10" height="40" fill="#2a3346" />
      <rect x={cx + 26} y={baseY + 14} width="10" height="40" fill="#2a3346" />

      {/* halo pulsante atrás do aparelho */}
      <motion.circle
        cx={cx}
        cy={baseY - 40}
        r="70"
        fill={halo}
        opacity="0.12"
        animate={{ opacity: [0.08, 0.22, 0.08], scale: [1, 1.12, 1] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        style={{ transformOrigin: `${cx}px ${baseY - 40}px` }}
      />

      {/* ondas de som concêntricas */}
      {[0, 1, 2].map((i) => (
        <motion.circle
          key={i}
          cx={cx}
          cy={baseY - 40}
          r="30"
          fill="none"
          stroke={halo}
          strokeWidth="2"
          animate={{ r: [30, 70], opacity: [0.5, 0] }}
          transition={{ duration: 2.4, repeat: Infinity, ease: "easeOut", delay: i * 0.8 }}
        />
      ))}

      {/* aparelho por forma */}
      {shape === "cylinder" && (
        <g>
          <ellipse cx={cx} cy={baseY - 64} rx="34" ry="10" fill={halo} opacity="0.9" />
          <rect x={cx - 34} y={baseY - 64} width="68" height="24" fill="#1b2536" />
          <ellipse cx={cx} cy={baseY - 40} rx="34" ry="10" fill="#2a3346" />
          <motion.ellipse
            cx={cx}
            cy={baseY - 64}
            rx="30"
            ry="3.5"
            fill={halo}
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
          />
        </g>
      )}

      {shape === "screen" && (
        <g>
          <rect x={cx - 30} y={baseY - 70} width="60" height="58" rx="10" fill="#1b2536" />
          <rect x={cx - 24} y={baseY - 64} width="48" height="34" rx="4" fill="#0d1422" />
          <motion.circle
            cx={cx}
            cy={baseY - 47}
            r="6"
            fill={halo}
            animate={{ opacity: [0.4, 1, 0.4] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
          />
          <rect x={cx - 8} y={baseY - 18} width="16" height="10" rx="3" fill="#2a3346" />
        </g>
      )}

      {shape === "puck" && (
        <g>
          <ellipse cx={cx} cy={baseY - 30} rx="40" ry="14" fill="#1b2536" />
          <ellipse cx={cx} cy={baseY - 44} rx="40" ry="14" fill="#2a3346" />
          <motion.ellipse
            cx={cx}
            cy={baseY - 44}
            rx="32"
            ry="10"
            fill={halo}
            opacity="0.25"
            animate={{ opacity: [0.15, 0.45, 0.15] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          />
        </g>
      )}
    </motion.g>
  );
}