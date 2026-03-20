"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import SearchBar from "@/components/SearchBar";
import WeatherCard from "@/components/WeatherCard";
import ForecastSection from "@/components/ForecastSection";
import HourlyForecast from "@/components/HourlyForecast";
import UnitToggle from "@/components/UnitToggle";
import ErrorState from "@/components/ErrorState";
import AirQuality from "@/components/AirQuality";
import ExtraDetails from "@/components/ExtraDetails";
import { SkeletonCard, SkeletonForecast, SkeletonHourly } from "@/components/Loader";
import {
  fetchWeatherByCity,
  fetchWeatherByCoords,
  fetchForecastByCity,
  fetchForecastByCoords,
  fetchAirQuality,
  fetchUVIndex,
  AirQualityData,
} from "@/utils/api";
import { WeatherData, ForecastData } from "@/utils/helpers";
import { addRecentSearch } from "@/utils/localStorage";

type ErrorType = "not_found" | "network" | "api_key" | "general";

interface AppError {
  type: ErrorType;
  message?: string;
}

const DARK_GRADIENTS: Record<string, string> = {
  Clear: "from-amber-950 via-orange-950 to-rose-950",
  Clouds: "from-slate-900 via-slate-800 to-gray-900",
  Rain: "from-blue-950 via-indigo-950 to-slate-900",
  Drizzle: "from-blue-950 via-cyan-950 to-teal-950",
  Thunderstorm: "from-gray-950 via-gray-900 to-indigo-950",
  Snow: "from-slate-800 via-blue-950 to-indigo-950",
  Mist: "from-gray-800 via-gray-900 to-slate-800",
  Haze: "from-amber-950 via-yellow-950 to-orange-950",
  Fog: "from-gray-700 via-gray-800 to-slate-900",
};

export default function Home() {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [forecast, setForecast] = useState<ForecastData | null>(null);
  const [airQuality, setAirQuality] = useState<AirQualityData | null>(null);
  const [uvIndex, setUvIndex] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isGeoLoading, setIsGeoLoading] = useState(false);
  const [error, setError] = useState<AppError | null>(null);
  const [unit, setUnit] = useState<"C" | "F">("C");
  const [bgGradient, setBgGradient] = useState("from-slate-900 via-blue-950 to-indigo-950");

  useEffect(() => {
    if (weather) {
      const condition = weather.weather[0].main;
      setBgGradient(DARK_GRADIENTS[condition] ?? "from-slate-900 via-blue-950 to-indigo-950");
    }
  }, [weather]);

  const parseError = (err: unknown): AppError => {
    const apiErr = err as { response?: { status?: number; data?: { message?: string } }; code?: string };
    const key = process.env.NEXT_PUBLIC_WEATHER_API_KEY;
    if (!key || key === "your_api_key_here") return { type: "api_key" };
    if (apiErr?.response?.status === 404) return { type: "not_found" };
    if (apiErr?.response?.status === 401) return { type: "api_key", message: "Invalid API key. Check your .env.local file." };
    if (apiErr?.code === "ERR_NETWORK") return { type: "network" };
    return { type: "general", message: apiErr?.response?.data?.message };
  };

  // Load extra data (UV + AQI) from coordinates after weather is fetched
  const loadExtraData = useCallback(async (lat: number, lon: number) => {
    try {
      const [aqData, uvData] = await Promise.allSettled([
        fetchAirQuality(lat, lon),
        fetchUVIndex(lat, lon),
      ]);
      if (aqData.status === "fulfilled") setAirQuality(aqData.value);
      if (uvData.status === "fulfilled") setUvIndex(uvData.value);
    } catch {
      // Extra data failure is non-blocking
    }
  }, []);

  const searchByCity = useCallback(async (city: string) => {
    setIsLoading(true);
    setError(null);
    setAirQuality(null);
    setUvIndex(0);
    try {
      const [weatherData, forecastData] = await Promise.all([
        fetchWeatherByCity(city),
        fetchForecastByCity(city),
      ]);
      setWeather(weatherData);
      setForecast(forecastData);
      addRecentSearch(weatherData.name + ", " + weatherData.sys.country);
      // Load secondary data, don't block the main render
      loadExtraData(weatherData.coord.lat, weatherData.coord.lon);
    } catch (err) {
      setError(parseError(err));
      setWeather(null);
      setForecast(null);
    } finally {
      setIsLoading(false);
    }
  }, [loadExtraData]);

  const handleGeolocate = useCallback(() => {
    if (!navigator.geolocation) {
      setError({ type: "general", message: "Geolocation is not supported." });
      return;
    }
    setIsGeoLoading(true);
    setError(null);
    setAirQuality(null);
    setUvIndex(0);
    navigator.geolocation.getCurrentPosition(
      async ({ coords }) => {
        try {
          const [weatherData, forecastData] = await Promise.all([
            fetchWeatherByCoords(coords.latitude, coords.longitude),
            fetchForecastByCoords(coords.latitude, coords.longitude),
          ]);
          setWeather(weatherData);
          setForecast(forecastData);
          addRecentSearch(weatherData.name + ", " + weatherData.sys.country);
          loadExtraData(coords.latitude, coords.longitude);
        } catch (err) {
          setError(parseError(err));
        } finally {
          setIsGeoLoading(false);
        }
      },
      () => {
        setIsGeoLoading(false);
        setError({ type: "general", message: "Location access denied. Search for a city instead." });
      },
      { timeout: 10000 }
    );
  }, [loadExtraData]);

  // Auto-load on mount
  useEffect(() => {
    searchByCity("New York");
  }, [searchByCity]);

  const hasData = weather && forecast;

  return (
    <main
      className={`min-h-screen bg-gradient-to-br ${bgGradient} transition-all duration-1000 ease-in-out relative overflow-hidden`}
    >
      {/* Animated background blobs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none" aria-hidden>
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-blob" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-blob animation-delay-2000" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-500/5 rounded-full blur-3xl animate-blob animation-delay-4000" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-4 py-8 sm:py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-8"
        >
          <div>
            <h1 className="text-2xl font-black text-white tracking-tight">
              ☁ WeatherScope
            </h1>
            <p className="text-white/40 text-xs mt-0.5">Real-time weather intelligence</p>
          </div>
          <UnitToggle unit={unit} onToggle={() => setUnit((u) => (u === "C" ? "F" : "C"))} />
        </motion.div>

        {/* Search Bar */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <SearchBar
            onSearch={searchByCity}
            onGeolocate={handleGeolocate}
            isLoading={isGeoLoading}
          />
        </motion.div>

        {/* Content */}
        <AnimatePresence mode="wait">
          {isLoading ? (
            <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-4">
              <SkeletonCard />
              <SkeletonHourly />
              <SkeletonForecast />
            </motion.div>
          ) : error ? (
            <motion.div key="error" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <ErrorState type={error.type} message={error.message} onRetry={weather ? () => searchByCity(weather.name) : undefined} />
            </motion.div>
          ) : hasData ? (
            <motion.div key={weather.name + weather.dt} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-4">
              <WeatherCard data={weather} unit={unit} />
              <HourlyForecast items={forecast.list} unit={unit} timezone={forecast.city.timezone} />
              <ForecastSection data={forecast} unit={unit} />
              <ExtraDetails data={weather} uvIndex={uvIndex} />
              {airQuality && <AirQuality data={airQuality} />}
              <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }} className="text-center text-white/20 text-xs pb-4">
                Data from OpenWeather API • Last updated{" "}
                {new Date(weather.dt * 1000).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}
              </motion.p>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>
    </main>
  );
}
