"use client";

import { motion } from "framer-motion";
import {
  Sun,
  Droplets,
  Cloud,
  Layers,
  Navigation,
  Gauge,
} from "lucide-react";
import { WeatherData } from "@/utils/helpers";
import { formatWindSpeed, getWindDirection } from "@/utils/helpers";

interface ExtraDetailsProps {
  data: WeatherData;
  uvIndex?: number;
}

function getUVLabel(uv: number): { label: string; color: string; pct: number } {
  if (uv <= 2) return { label: "Low", color: "bg-emerald-500", pct: (uv / 11) * 100 };
  if (uv <= 5) return { label: "Moderate", color: "bg-yellow-400", pct: (uv / 11) * 100 };
  if (uv <= 7) return { label: "High", color: "bg-orange-500", pct: (uv / 11) * 100 };
  if (uv <= 10) return { label: "Very High", color: "bg-red-500", pct: (uv / 11) * 100 };
  return { label: "Extreme", color: "bg-purple-600", pct: 100 };
}

function getDewPoint(tempC: number, humidity: number): number {
  // Magnus formula
  const a = 17.27;
  const b = 237.7;
  const alpha = ((a * tempC) / (b + tempC)) + Math.log(humidity / 100);
  return Math.round((b * alpha) / (a - alpha));
}

export default function ExtraDetails({ data, uvIndex = 0 }: ExtraDetailsProps) {
  const uv = getUVLabel(uvIndex);
  const dewPoint = getDewPoint(data.main.temp, data.main.humidity);
  const cloudCover = (data as WeatherData & { clouds?: { all: number } }).clouds?.all ?? 0;
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="glass-card p-5 sm:p-6"
    >
      <h2 className="text-white/80 text-sm uppercase tracking-widest font-semibold mb-4">
        Additional Details
      </h2>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {/* UV Index */}
        <div className="bg-white/5 rounded-xl p-4 border border-white/5">
          <div className="flex items-center gap-2 mb-2">
            <Sun className="w-4 h-4 text-yellow-400" />
            <span className="text-white/50 text-xs uppercase tracking-wider font-medium">UV Index</span>
          </div>
          <p className="text-white font-bold text-xl mb-1">{uvIndex.toFixed(1)}</p>
          <p className="text-white/50 text-xs mb-2">{uv.label}</p>
          <div className="h-1.5 w-full rounded-full bg-white/10 overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${Math.min(uv.pct, 100)}%` }}
              transition={{ duration: 0.7, ease: "easeOut" }}
              className={`h-full rounded-full ${uv.color}`}
            />
          </div>
        </div>

        {/* Dew Point */}
        <div className="bg-white/5 rounded-xl p-4 border border-white/5">
          <div className="flex items-center gap-2 mb-2">
            <Droplets className="w-4 h-4 text-blue-400" />
            <span className="text-white/50 text-xs uppercase tracking-wider font-medium">Dew Point</span>
          </div>
          <p className="text-white font-bold text-xl">{dewPoint}°C</p>
          <p className="text-white/40 text-xs mt-1">
            {dewPoint >= 24 ? "Very muggy" : dewPoint >= 18 ? "Muggy" : dewPoint >= 13 ? "Comfortable" : "Dry"}
          </p>
        </div>

        {/* Cloud Cover */}
        <div className="bg-white/5 rounded-xl p-4 border border-white/5">
          <div className="flex items-center gap-2 mb-2">
            <Cloud className="w-4 h-4 text-slate-400" />
            <span className="text-white/50 text-xs uppercase tracking-wider font-medium">Cloud Cover</span>
          </div>
          <p className="text-white font-bold text-xl">{cloudCover}%</p>
          <p className="text-white/40 text-xs mt-1">
            {cloudCover < 25 ? "Clear sky" : cloudCover < 50 ? "Partly cloudy" : cloudCover < 75 ? "Mostly cloudy" : "Overcast"}
          </p>
          <div className="h-1.5 w-full rounded-full bg-white/10 mt-2 overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${cloudCover}%` }}
              transition={{ duration: 0.7, ease: "easeOut" }}
              className="h-full rounded-full bg-slate-400"
            />
          </div>
        </div>

        {/* Atmospheric Pressure */}
        <div className="bg-white/5 rounded-xl p-4 border border-white/5">
          <div className="flex items-center gap-2 mb-2">
            <Gauge className="w-4 h-4 text-purple-400" />
            <span className="text-white/50 text-xs uppercase tracking-wider font-medium">Pressure</span>
          </div>
          <p className="text-white font-bold text-xl">{data.main.pressure}</p>
          <p className="text-white/40 text-xs mt-1">
            hPa &bull; {data.main.pressure > 1013 ? "High pressure" : "Low pressure"}
          </p>
        </div>

        {/* Wind Direction */}
        <div className="bg-white/5 rounded-xl p-4 border border-white/5">
          <div className="flex items-center gap-2 mb-2">
            <Navigation className="w-4 h-4 text-cyan-400" />
            <span className="text-white/50 text-xs uppercase tracking-wider font-medium">Wind Dir.</span>
          </div>
          <div className="flex items-center gap-3">
            <motion.div
              animate={{ rotate: data.wind.deg }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center bg-white/5 flex-shrink-0"
            >
              <Navigation className="w-4 h-4 text-cyan-400" />
            </motion.div>
            <div>
              <p className="text-white font-bold">{getWindDirection(data.wind.deg)}</p>
              <p className="text-white/40 text-xs">{data.wind.deg}°</p>
            </div>
          </div>
        </div>

        {/* Sea Level (if available) */}
        <div className="bg-white/5 rounded-xl p-4 border border-white/5">
          <div className="flex items-center gap-2 mb-2">
            <Layers className="w-4 h-4 text-teal-400" />
            <span className="text-white/50 text-xs uppercase tracking-wider font-medium">Sea Level</span>
          </div>
          <p className="text-white font-bold text-xl">
            {(data.main as WeatherData["main"] & { sea_level?: number }).sea_level ?? data.main.pressure}
          </p>
          <p className="text-white/40 text-xs mt-1">hPa at sea level</p>
        </div>
      </div>
    </motion.div>
  );
}
