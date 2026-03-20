"use client";

import { motion, AnimatePresence } from "framer-motion";
import ForecastCard from "@/components/ForecastCard";
import { ForecastData, ForecastItem } from "@/utils/helpers";
import { groupByDay } from "@/utils/helpers";

interface ForecastSectionProps {
  data: ForecastData;
  unit: "C" | "F";
}

export default function ForecastSection({ data, unit }: ForecastSectionProps) {
  // Group by day, skip "today" (index 0 group)
  const grouped = groupByDay(data.list);
  const days = Object.entries(grouped).slice(0, 5); // 5-day forecast

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.25 }}
      className="glass-card p-5 sm:p-6"
    >
      <h2 className="text-white/80 text-sm uppercase tracking-widest font-semibold mb-4">
        5-Day Forecast
      </h2>
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        <AnimatePresence>
          {days.map(([day, items], index) => (
            <ForecastCard
              key={day}
              items={items as ForecastItem[]}
              unit={unit}
              index={index}
            />
          ))}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
