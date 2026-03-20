"use client";

import { motion } from "framer-motion";
import { AlertTriangle, CloudOff, WifiOff, RefreshCw } from "lucide-react";

type ErrorType = "not_found" | "network" | "api_key" | "general";

interface ErrorStateProps {
  type?: ErrorType;
  message?: string;
  onRetry?: () => void;
}

const ERROR_CONFIG: Record<ErrorType, { icon: React.ReactNode; title: string; description: string }> = {
  not_found: {
    icon: <CloudOff className="w-12 h-12 text-white/40" />,
    title: "City Not Found",
    description: "We couldn't find weather data for that city. Please check the spelling and try again.",
  },
  network: {
    icon: <WifiOff className="w-12 h-12 text-white/40" />,
    title: "Connection Error",
    description: "Unable to reach the weather service. Check your internet connection and try again.",
  },
  api_key: {
    icon: <AlertTriangle className="w-12 h-12 text-amber-400/60" />,
    title: "API Key Missing",
    description: "Set NEXT_PUBLIC_WEATHER_API_KEY in your .env.local file to get started.",
  },
  general: {
    icon: <AlertTriangle className="w-12 h-12 text-white/40" />,
    title: "Something Went Wrong",
    description: "An unexpected error occurred. Please try again.",
  },
};

export default function ErrorState({ type = "general", message, onRetry }: ErrorStateProps) {
  const config = ERROR_CONFIG[type];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card p-8 sm:p-12 flex flex-col items-center text-center gap-4"
    >
      <motion.div
        initial={{ scale: 0.8 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 120 }}
      >
        {config.icon}
      </motion.div>
      <div>
        <h3 className="text-white font-bold text-xl mb-2">{config.title}</h3>
        <p className="text-white/50 text-sm max-w-xs leading-relaxed">
          {message || config.description}
        </p>
      </div>
      {onRetry && (
        <button
          onClick={onRetry}
          className="flex items-center gap-2 bg-white/10 hover:bg-white/20 transition-colors text-white text-sm px-5 py-2.5 rounded-xl font-medium mt-2"
        >
          <RefreshCw className="w-4 h-4" />
          Try Again
        </button>
      )}
    </motion.div>
  );
}
