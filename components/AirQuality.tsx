"use client";

import { motion } from "framer-motion";
import { Wind, AlertTriangle } from "lucide-react";
import { AirQualityData } from "@/utils/api";

interface AirQualityProps {
  data: AirQualityData;
}

const AQI_LEVELS = [
  { max: 1, label: "Good", color: "text-emerald-400", bg: "bg-emerald-500", desc: "Air quality is satisfactory." },
  { max: 2, label: "Fair", color: "text-yellow-400", bg: "bg-yellow-500", desc: "Acceptable air quality." },
  { max: 3, label: "Moderate", color: "text-orange-400", bg: "bg-orange-500", desc: "Sensitive groups may be affected." },
  { max: 4, label: "Poor", color: "text-red-400", bg: "bg-red-500", desc: "Health effects for everyone." },
  { max: 5, label: "Very Poor", color: "text-purple-400", bg: "bg-purple-500", desc: "Emergency health conditions." },
];

export default function AirQuality({ data }: AirQualityProps) {
  const aqi = data.list[0].main.aqi;
  const components = data.list[0].components;
  const level = AQI_LEVELS[aqi - 1] ?? AQI_LEVELS[0];
  const pct = ((aqi - 1) / 4) * 100;

  const pollutants = [
    { label: "PM2.5", value: components.pm2_5.toFixed(1), unit: "μg/m³", limit: 25, tip: "Fine particles" },
    { label: "PM10", value: components.pm10.toFixed(1), unit: "μg/m³", limit: 50, tip: "Coarse particles" },
    { label: "O₃", value: components.o3.toFixed(1), unit: "μg/m³", limit: 120, tip: "Ozone" },
    { label: "NO₂", value: components.no2.toFixed(1), unit: "μg/m³", limit: 40, tip: "Nitrogen dioxide" },
    { label: "SO₂", value: components.so2.toFixed(1), unit: "μg/m³", limit: 350, tip: "Sulphur dioxide" },
    { label: "CO", value: (components.co / 1000).toFixed(2), unit: "mg/m³", limit: 10, tip: "Carbon monoxide" },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="glass-card p-5 sm:p-6"
    >
      <div className="flex items-center gap-2 mb-4">
        <Wind className="w-4 h-4 text-white/50" />
        <h2 className="text-white/80 text-sm uppercase tracking-widest font-semibold">
          Air Quality Index
        </h2>
      </div>

      {/* AQI Bar */}
      <div className="mb-5">
        <div className="flex items-end justify-between mb-2">
          <div>
            <span className={`text-3xl font-black ${level.color}`}>{level.label}</span>
            <p className="text-white/40 text-xs mt-1">{level.desc}</p>
          </div>
          <div className="text-right">
            <span className="text-white/30 text-xs">AQI</span>
            <p className={`text-2xl font-bold ${level.color}`}>{aqi}/5</p>
          </div>
        </div>
        {/* gradient bar */}
        <div className="h-2 w-full rounded-full bg-white/10 overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${pct === 0 ? 15 : pct}%` }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className={`h-full rounded-full ${level.bg}`}
          />
        </div>
        <div className="flex justify-between mt-1.5 text-[10px] text-white/25">
          <span>Good</span><span>Fair</span><span>Moderate</span><span>Poor</span><span>Very Poor</span>
        </div>
      </div>

      {/* Pollutants grid */}
      <div className="grid grid-cols-3 gap-2">
        {pollutants.map((p) => {
          const ratio = Math.min(parseFloat(p.value) / p.limit, 1);
          const barColor = ratio < 0.5 ? "bg-emerald-500" : ratio < 0.8 ? "bg-yellow-500" : "bg-red-500";
          return (
            <div key={p.label} className="bg-white/5 rounded-xl p-3 border border-white/5">
              <div className="flex items-center justify-between mb-1">
                <span className="text-white/50 text-[11px] font-semibold">{p.label}</span>
                {ratio > 0.8 && <AlertTriangle className="w-3 h-3 text-red-400" />}
              </div>
              <p className="text-white font-bold text-sm">{p.value}</p>
              <p className="text-white/30 text-[10px]">{p.unit}</p>
              <div className="h-1 w-full rounded-full bg-white/10 mt-2 overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${ratio * 100}%` }}
                  transition={{ duration: 0.6, ease: "easeOut" }}
                  className={`h-full rounded-full ${barColor}`}
                />
              </div>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
}
