"use client";

import { useState } from "react";
import { motion } from "framer-motion";

export interface ContactData {
  name: string;
  email: string;
  phone: string;
  city: string;
  state: string;
  latitude?: number | null;
  longitude?: number | null;
  geo_source?: string | null;
}

interface ContactFormProps {
  onSubmit: (data: ContactData) => void;
  onBack: () => void;
}

export function ContactForm({ onSubmit, onBack }: ContactFormProps) {
  const [data, setData] = useState<ContactData>({
    name: "",
    email: "",
    phone: "",
    city: "",
    state: "",
    latitude: null,
    longitude: null,
    geo_source: null,
  });
  const [loadingGeo, setLoadingGeo] = useState(false);

  function update(field: keyof ContactData, value: string) {
    setData((d) => ({ ...d, [field]: value }));
  }

  async function applyGeoFromCoords(latitude: number, longitude: number) {
    const resp = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`
    );
    const json = await resp.json();
    const addr = json.address || {};
    setData((d) => ({
      ...d,
      city: addr.city || addr.town || addr.municipality || addr.suburb || "",
      state: addr.state_code || addr.state || "",
      latitude,
      longitude,
      geo_source: "geolocation",
    }));
  }

  async function applyGeoFromIP() {
    const resp = await fetch("https://ipapi.co/json/");
    if (!resp.ok) throw new Error("IP lookup failed");
    const json = await resp.json();
    setData((d) => ({
      ...d,
      city: json.city || "",
      state: json.region_code || json.region || "",
      latitude: json.latitude ?? null,
      longitude: json.longitude ?? null,
      geo_source: "ip_fallback",
    }));
  }

  async function fillLocation() {
    setLoadingGeo(true);

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          try {
            await applyGeoFromCoords(pos.coords.latitude, pos.coords.longitude);
          } catch {
            // silently fallback to IP on reverse geocode failure
            try {
              await applyGeoFromIP();
            } catch {
              alert("Não foi possível identificar a cidade. Preencha manualmente.");
            }
          } finally {
            setLoadingGeo(false);
          }
        },
        async () => {
          // user denied geolocation → try IP fallback
          try {
            await applyGeoFromIP();
          } catch {
            alert("Não foi possível usar a localização. Preencha manualmente.");
          } finally {
            setLoadingGeo(false);
          }
        },
        { timeout: 8000, enableHighAccuracy: false }
      );
    } else {
      try {
        await applyGeoFromIP();
      } catch {
        alert("Geolocalização não disponível no seu navegador. Preencha manualmente.");
      } finally {
        setLoadingGeo(false);
      }
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="mx-auto w-full max-w-xl"
    >
      <div className="glass-card p-8 sm:p-12">
        <p className="text-sm font-semibold uppercase tracking-wider text-cyan-300">
          Quase lá
        </p>
        <h2 className="mt-3 text-3xl font-bold text-white">Receba sua recomendação</h2>
        <p className="mt-2 text-slate-300">
          Preencha para salvar seu projeto. Você pode refazer o diagnóstico quando quiser.
        </p>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            onSubmit(data);
          }}
          className="mt-8 space-y-4"
        >
          <input
            required
            type="text"
            placeholder="Nome completo"
            value={data.name}
            onChange={(e) => update("name", e.target.value)}
            className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-slate-500 outline-none focus:border-cyan-400"
          />
          <input
            required
            type="email"
            placeholder="E-mail"
            value={data.email}
            onChange={(e) => update("email", e.target.value)}
            className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-slate-500 outline-none focus:border-cyan-400"
          />
          <input
            required
            type="tel"
            placeholder="WhatsApp / telefone"
            value={data.phone}
            onChange={(e) => update("phone", e.target.value)}
            className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-slate-500 outline-none focus:border-cyan-400"
          />

          <div className="grid gap-3 sm:grid-cols-2 sm:gap-4">
            <input
              type="text"
              placeholder="Cidade"
              value={data.city}
              onChange={(e) => update("city", e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-slate-500 outline-none focus:border-cyan-400"
            />
            <input
              type="text"
              placeholder="Estado"
              value={data.state}
              onChange={(e) => update("state", e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-slate-500 outline-none focus:border-cyan-400"
            />
          </div>

          <button
            type="button"
            onClick={fillLocation}
            disabled={loadingGeo}
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-medium text-slate-300 transition hover:bg-white/10 sm:w-auto"
          >
            {loadingGeo ? "Localizando..." : "📍 Usar minha localização"}
          </button>

          <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row">
            <button
              type="button"
              onClick={onBack}
              className="rounded-full border border-white/20 bg-white/5 px-6 py-3 font-semibold text-white transition hover:bg-white/10"
            >
              ← Voltar
            </button>
            <button
              type="submit"
              className="flex-1 rounded-full bg-cyan-400 px-6 py-3 font-bold text-slate-950 shadow-[0_0_25px_rgba(34,211,238,0.35)] transition hover:bg-cyan-300"
            >
              Ver minha recomendação
            </button>
          </div>
        </form>
      </div>
    </motion.div>
  );
}
