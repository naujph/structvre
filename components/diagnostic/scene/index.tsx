"use client";

import { useMemo } from "react";
import { resolveScene, MOODS } from "@/lib/diagnostic/scene";
import { RoomLayer } from "./room-layer";
import { MoodOverlay } from "./mood-overlay";
import { PropsLayer } from "./props-layer";
import { DeviceLayer } from "./device-layer";

interface DiagnosticSceneProps {
  answers: Record<string, string | string[] | null | undefined>;
  lastAnsweredCode?: string | null;
}

/**
 * Cena de fundo do diagnóstico em camadas. Ocupa o slot -z-10 da página:
 * sala (SVG) → lavagem de mood → props por hobby → assistente → scrim.
 * A cena reflete o estado consolidado das respostas (evolui conforme o
 * usuário responde) e aparece também no resultado (sala montada final).
 */
export function DiagnosticScene({ answers, lastAnsweredCode }: DiagnosticSceneProps) {
  const scene = useMemo(
    () => resolveScene(answers, lastAnsweredCode),
    [answers, lastAnsweredCode],
  );
  const palette = MOODS[scene.mood];

  return (
    <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
      {/* base clara por baixo da sala (fallback, geralmente coberta pelo SVG) */}
      <div className="absolute inset-0 bg-slate-200" />
      <RoomLayer room={scene.room} palette={palette} />
      <MoodOverlay palette={palette} />
      <PropsLayer props={scene.props} />
      <DeviceLayer device={scene.device} />
      <AmbientMotes />

      {/* vinheta leve só pra profundidade — a cena clara fica visível nas laterais,
          e o card (glass-card quase opaco) se sustenta sozinho no centro */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/25" />
    </div>
  );
}

/** Partículas de luz ambientes (drift suave via CSS keyframe scene-drift). */
const MOTES = [
  { left: "12%", top: "62%", delay: "0s", dur: "14s" },
  { left: "28%", top: "48%", delay: "3s", dur: "17s" },
  { left: "46%", top: "70%", delay: "6s", dur: "13s" },
  { left: "64%", top: "40%", delay: "2s", dur: "16s" },
  { left: "78%", top: "58%", delay: "5s", dur: "15s" },
  { left: "88%", top: "34%", delay: "8s", dur: "18s" },
];

function AmbientMotes() {
  return (
    <div className="absolute inset-0 overflow-hidden">
      {MOTES.map((m, i) => (
        <span
          key={i}
          className="scene-mote"
          style={{
            left: m.left,
            top: m.top,
            animationDelay: m.delay,
            animationDuration: m.dur,
          }}
        />
      ))}
    </div>
  );
}