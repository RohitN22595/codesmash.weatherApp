"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import {
  Droplets,
  Wind,
  Eye,
  Thermometer,
  Gauge,
  Sunrise,
  Sunset,
} from "lucide-react";
import { WeatherData } from "@/utils/helpers";
import {
  formatTemp,
  formatWindSpeed,
  formatVisibility,
  getWindDirection,
  unixToDate,
  formatHour,
  getWeatherIconUrl,
} from "@/utils/helpers";

interface WeatherCardProps {
  data: WeatherData;
  unit: "C" | "F";
}

export default function WeatherCard({ data, unit }: WeatherCardProps) {
  const temp = Math.round(data.main.temp);
  const feelsLike = Math.round(data.main.feels_like);
  const tempMin = Math.round(data.main.temp_min);
  const tempMax = Math.round(data.main.temp_max);
  const condition = data.weather[0];
  const sunrise = formatHour(unixToDate(data.sys.sunrise, data.timezone));
  const sunset = formatHour(unixToDate(data.sys.sunset, data.timezone));

  return (
    <motion.div
      initial={{ opacity: 0, y: 30, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="glass-card p-6 sm:p-8"
    >
      {/* Top: Location + Date */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <motion.h1
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="text-3xl sm:text-4xl font-bold text-white tracking-tight"
          >
            {data.name}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.15 }}
            className="text-white/60 text-sm mt-1"
          >
            {data.sys.country} &bull;{" "}
            {new Date().toLocaleDateString("en-US", {
              weekday: "long",
              month: "long",
              day: "numeric",
            })}
          </motion.p>
        </div>
        <div className="text-right">
          <p className="text-white/50 text-xs uppercase tracking-widest">Coordinates</p>
          <p className="text-white/70 text-xs mt-1">
            {data.coord.lat.toFixed(2)}° N, {data.coord.lon.toFixed(2)}° E
          </p>
        </div>
      </div>

      {/* Main temp + icon */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 120 }}
            className="text-7xl sm:text-8xl font-black text-white leading-none tracking-tighter"
          >
            {formatTemp(temp, unit).replace("°C", "°").replace("°F", "°")}
            <span className="text-3xl sm:text-4xl font-light text-white/70  ml-1">
              {unit === "C" ? "C" : "F"}
            </span>
          </motion.div>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-white/70 text-lg mt-2 capitalize"
          >
            {condition.description}
          </motion.p>
          <div className="flex items-center gap-4 mt-2">
            <span className="text-white/50 text-sm">
              H: {formatTemp(tempMax, unit)} &nbsp; L: {formatTemp(tempMin, unit)}
            </span>
          </div>
        </div>
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="relative w-24 h-24 sm:w-32 sm:h-32 flex-shrink-0"
        >
          <Image
            src={getWeatherIconUrl(condition.icon, "4x")}
            alt={condition.description}
            fill
            className="object-contain drop-shadow-2xl"
            unoptimized
          />
        </motion.div>
      </div>

      {/* Stats Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35 }}
        className="grid grid-cols-2 sm:grid-cols-3 gap-3"
      >
        <StatItem
          icon={<Thermometer className="w-4 h-4" />}
          label="Feels Like"
          value={formatTemp(feelsLike, unit)}
        />
        <StatItem
          icon={<Droplets className="w-4 h-4" />}
          label="Humidity"
          value={`${data.main.humidity}%`}
        />
        <StatItem
          icon={<Wind className="w-4 h-4" />}
          label="Wind"
          value={`${formatWindSpeed(data.wind.speed)} ${getWindDirection(data.wind.deg)}`}
        />
        <StatItem
          icon={<Eye className="w-4 h-4" />}
          label="Visibility"
          value={formatVisibility(data.visibility)}
        />
        <StatItem
          icon={<Gauge className="w-4 h-4" />}
          label="Pressure"
          value={`${data.main.pressure} hPa`}
        />
        <StatItem
          icon={<Sunrise className="w-4 h-4" />}
          label="Sunrise / Sunset"
          value={`${sunrise} / ${sunset}`}
        />
      </motion.div>
    </motion.div>
  );
}

function StatItem({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="bg-white/5 hover:bg-white/10 transition-colors rounded-xl p-3 border border-white/10">
      <div className="flex items-center gap-2 text-white/50 mb-1">
        {icon}
        <span className="text-xs uppercase tracking-wider font-medium">{label}</span>
      </div>
      <p className="text-white font-semibold text-sm sm:text-base">{value}</p>
    </div>
  );
}
