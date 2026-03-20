"use client";

import { motion } from "framer-motion";
import { Thermometer } from "lucide-react";

interface UnitToggleProps {
  unit: "C" | "F";
  onToggle: () => void;
}

export default function UnitToggle({ unit, onToggle }: UnitToggleProps) {
  return (
    <button
      onClick={onToggle}
      className="flex items-center gap-2 glass-card px-4 py-2 hover:bg-white/20 transition-all"
      aria-label="Toggle temperature unit"
    >
      <Thermometer className="w-4 h-4 text-white/60" />
      <div className="flex items-center gap-1">
        <motion.span
          className={`text-sm font-semibold transition-colors ${unit === "C" ? "text-white" : "text-white/40"}`}
        >
          °C
        </motion.span>
        <div className="relative w-8 h-4 mx-1 bg-white/10 rounded-full">
          <motion.div
            className="absolute top-0.5 w-3 h-3 bg-white rounded-full shadow"
            animate={{ left: unit === "C" ? "2px" : "18px" }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
          />
        </div>
        <motion.span
          className={`text-sm font-semibold transition-colors ${unit === "F" ? "text-white" : "text-white/40"}`}
        >
          °F
        </motion.span>
      </div>
    </button>
  );
}
