"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { Droplets, Wind } from "lucide-react";
import { ForecastItem } from "@/utils/helpers";
import {
  formatTemp,
  formatWeekday,
  getWeatherIconUrl,
  getDayForecast,
} from "@/utils/helpers";

interface ForecastCardProps {
  items: ForecastItem[];
  unit: "C" | "F";
  index?: number;
}

export default function ForecastCard({ items, unit, index = 0 }: ForecastCardProps) {
  const representative = getDayForecast(items);
  const condition = representative.weather[0];
  const date = new Date(representative.dt * 1000);

  // Get min/max across all items for this day
  const temps = items.map((i) => i.main.temp);
  const maxTemp = Math.round(Math.max(...temps));
  const minTemp = Math.round(Math.min(...temps));

  // Average precipitation probability
  const avgPop = Math.round(
    (items.reduce((sum, i) => sum + (i.pop || 0), 0) / items.length) * 100
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08 }}
      className="glass-card p-4 flex flex-col items-center gap-3 hover:bg-white/15 transition-colors"
    >
      <p className="text-white/60 text-xs uppercase tracking-wider font-semibold">
        {index === 0 ? "Tomorrow" : formatWeekday(date)}
      </p>
      <div className="relative w-14 h-14">
        <Image
          src={getWeatherIconUrl(condition.icon, "2x")}
          alt={condition.description}
          fill
          className="object-contain"
          unoptimized
        />
      </div>
      <p className="text-white/60 text-xs capitalize text-center leading-tight">
        {condition.description}
      </p>
      <div className="flex items-center gap-2 text-sm">
        <span className="text-white font-bold">{formatTemp(maxTemp, unit)}</span>
        <span className="text-white/40">/</span>
        <span className="text-white/50">{formatTemp(minTemp, unit)}</span>
      </div>
      <div className="flex items-center gap-3 text-xs text-white/40">
        {avgPop > 0 && (
          <div className="flex items-center gap-1">
            <Droplets className="w-3 h-3 text-blue-400" />
            <span>{avgPop}%</span>
          </div>
        )}
        <div className="flex items-center gap-1">
          <Wind className="w-3 h-3" />
          <span>{Math.round(representative.wind.speed * 3.6)} km/h</span>
        </div>
      </div>
    </motion.div>
  );
}
