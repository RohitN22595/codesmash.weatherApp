"use client";

import { useRef } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { Droplets, ChevronLeft, ChevronRight } from "lucide-react";
import { ForecastItem } from "@/utils/helpers";
import { formatTemp, formatHour, getWeatherIconUrl } from "@/utils/helpers";

interface HourlyForecastProps {
  items: ForecastItem[];
  unit: "C" | "F";
  timezone: number;
}

export default function HourlyForecast({ items, unit, timezone }: HourlyForecastProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  // Take next 24 hours (8 items × 3 hours = 24h)
  const next24 = items.slice(0, 8);

  const scroll = (dir: "left" | "right") => {
    if (!scrollRef.current) return;
    const amount = 200;
    scrollRef.current.scrollBy({
      left: dir === "right" ? amount : -amount,
      behavior: "smooth",
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="glass-card p-5 sm:p-6"
    >
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-white/80 text-sm uppercase tracking-widest font-semibold">
          Hourly Forecast
        </h2>
        <div className="flex gap-2">
          <button
            onClick={() => scroll("left")}
            className="text-white/40 hover:text-white transition-colors p-1"
            aria-label="Scroll left"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={() => scroll("right")}
            className="text-white/40 hover:text-white transition-colors p-1"
            aria-label="Scroll right"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div
        ref={scrollRef}
        className="flex gap-3 overflow-x-auto scrollbar-hide pb-2"
        style={{ scrollbarWidth: "none" }}
      >
        {next24.map((item, i) => {
          const date = new Date((item.dt + timezone) * 1000);
          return (
            <motion.div
              key={item.dt}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="flex flex-col items-center gap-2 bg-white/5 hover:bg-white/10 transition-colors rounded-xl p-3 flex-shrink-0 min-w-[70px]"
            >
              <span className="text-white/50 text-xs font-medium">
                {i === 0 ? "Now" : formatHour(date)}
              </span>
              <div className="relative w-10 h-10">
                <Image
                  src={getWeatherIconUrl(item.weather[0].icon, "2x")}
                  alt={item.weather[0].description}
                  fill
                  className="object-contain"
                  unoptimized
                />
              </div>
              <span className="text-white font-semibold text-sm">
                {formatTemp(Math.round(item.main.temp), unit)}
              </span>
              {item.pop > 0 && (
                <div className="flex items-center gap-0.5 text-blue-300 text-xs">
                  <Droplets className="w-3 h-3" />
                  <span>{Math.round(item.pop * 100)}%</span>
                </div>
              )}
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}
