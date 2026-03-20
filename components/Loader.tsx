"use client";

import { motion } from "framer-motion";

export function SkeletonCard() {
  return (
    <div className="glass-card p-6 sm:p-8 animate-pulse">
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <div className="h-8 w-40 bg-white/10 rounded-lg mb-2" />
          <div className="h-4 w-28 bg-white/10 rounded-lg" />
        </div>
        <div className="h-10 w-24 bg-white/10 rounded-lg" />
      </div>
      {/* Temp */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="h-20 w-48 bg-white/10 rounded-xl mb-2" />
          <div className="h-5 w-32 bg-white/10 rounded-lg mb-2" />
          <div className="h-4 w-40 bg-white/10 rounded-lg" />
        </div>
        <div className="h-24 w-24 bg-white/10 rounded-full" />
      </div>
      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="h-16 bg-white/10 rounded-xl" />
        ))}
      </div>
    </div>
  );
}

export function SkeletonForecast() {
  return (
    <div className="glass-card p-5 sm:p-6 animate-pulse">
      <div className="h-4 w-32 bg-white/10 rounded-lg mb-4" />
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="h-36 bg-white/10 rounded-xl" />
        ))}
      </div>
    </div>
  );
}

export function SkeletonHourly() {
  return (
    <div className="glass-card p-5 sm:p-6 animate-pulse">
      <div className="h-4 w-32 bg-white/10 rounded-lg mb-4" />
      <div className="flex gap-3 overflow-hidden">
        {[...Array(7)].map((_, i) => (
          <div key={i} className="h-28 w-[70px] flex-shrink-0 bg-white/10 rounded-xl" />
        ))}
      </div>
    </div>
  );
}

export function FullPageLoader() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col items-center justify-center py-20 gap-4"
    >
      <div className="relative w-16 h-16">
        <div className="absolute inset-0 border-4 border-white/10 rounded-full" />
        <div className="absolute inset-0 border-4 border-transparent border-t-white/60 rounded-full animate-spin" />
      </div>
      <p className="text-white/50 text-sm animate-pulse">Fetching weather data...</p>
    </motion.div>
  );
}
