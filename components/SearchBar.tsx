"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, MapPin, Clock, X, Loader2, TrendingUp } from "lucide-react";
import {
  getRecentSearches,
  addRecentSearch,
  removeRecentSearch,
} from "@/utils/localStorage";
import { fetchCitySuggestions, CitySuggestion } from "@/utils/api";

interface SearchBarProps {
  onSearch: (city: string) => void;
  onGeolocate: () => void;
  isLoading?: boolean;
}

export default function SearchBar({
  onSearch,
  onGeolocate,
  isLoading,
}: SearchBarProps) {
  const [query, setQuery] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [suggestions, setSuggestions] = useState<CitySuggestion[]>([]);
  const [isSuggestionsLoading, setIsSuggestionsLoading] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setRecentSearches(getRecentSearches());
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setIsFocused(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const fetchSuggestions = useCallback(async (q: string) => {
    if (q.length < 2) { setSuggestions([]); return; }
    setIsSuggestionsLoading(true);
    try {
      const data = await fetchCitySuggestions(q);
      setSuggestions(data);
    } catch { setSuggestions([]); }
    finally { setIsSuggestionsLoading(false); }
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setQuery(val);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => fetchSuggestions(val), 350);
  };

  const handleSubmit = (city: string) => {
    if (!city.trim()) return;
    addRecentSearch(city.trim());
    setRecentSearches(getRecentSearches());
    onSearch(city.trim());
    setQuery("");
    setSuggestions([]);
    setIsFocused(false);
    inputRef.current?.blur();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleSubmit(query);
    if (e.key === "Escape") { setIsFocused(false); inputRef.current?.blur(); }
  };

  const handleRemoveRecent = (city: string, e: React.MouseEvent) => {
    e.stopPropagation();
    removeRecentSearch(city);
    setRecentSearches(getRecentSearches());
  };

  const showDropdown = isFocused && (query.length > 0 || recentSearches.length > 0);

  return (
    <div ref={wrapperRef} className="relative w-full max-w-2xl mx-auto z-50">
      {/* ── Search pill ─────────────────────────────── */}
      <div
        className={`flex items-center h-14 rounded-2xl overflow-hidden transition-all duration-300 ${
          isFocused
            ? "ring-2 ring-white/30 shadow-[0_0_40px_rgba(255,255,255,0.08)]"
            : "shadow-lg"
        }`}
        style={{
          background: "rgba(255,255,255,0.08)",
          backdropFilter: "blur(24px)",
          WebkitBackdropFilter: "blur(24px)",
          border: "1px solid rgba(255,255,255,0.14)",
        }}
      >
        {/* Search icon */}
        <div className="flex items-center justify-center w-14 h-full flex-shrink-0">
          {isSuggestionsLoading ? (
            <Loader2 className="w-5 h-5 text-white/40 animate-spin" />
          ) : (
            <Search className="w-5 h-5 text-white/40" />
          )}
        </div>

        {/* Input */}
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={() => setIsFocused(true)}
          placeholder="Search any city worldwide..."
          className="flex-1 bg-transparent text-white placeholder-white/30 text-[15px] font-medium outline-none min-w-0 pr-2"
          aria-label="Search city"
          autoComplete="off"
          spellCheck={false}
        />

        {/* Clear button */}
        <AnimatePresence>
          {query && (
            <motion.button
              initial={{ opacity: 0, scale: 0.7 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.7 }}
              transition={{ duration: 0.15 }}
              onMouseDown={() => { setQuery(""); setSuggestions([]); }}
              className="flex items-center justify-center w-8 h-8 rounded-full hover:bg-white/10 text-white/40 hover:text-white transition-all mr-1 flex-shrink-0"
              aria-label="Clear"
            >
              <X className="w-4 h-4" />
            </motion.button>
          )}
        </AnimatePresence>

        {/* Divider */}
        <div className="w-px h-6 bg-white/10 flex-shrink-0" />

        {/* Location button */}
        <button
          onMouseDown={(e) => { e.preventDefault(); onGeolocate(); }}
          disabled={isLoading}
          className="flex items-center gap-2 h-full px-5 text-white/50 hover:text-white hover:bg-white/8 transition-all flex-shrink-0 group"
          aria-label="Use my location"
        >
          {isLoading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <MapPin className="w-4 h-4 group-hover:text-blue-400 transition-colors" />
          )}
          <span className="hidden sm:inline text-sm font-medium">Locate me</span>
        </button>
      </div>

      {/* ── Dropdown ────────────────────────────────── */}
      <AnimatePresence>
        {showDropdown && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.98 }}
            transition={{ duration: 0.16, ease: "easeOut" }}
            className="absolute top-[calc(100%+8px)] left-0 right-0 rounded-2xl overflow-hidden"
            style={{
              background: "rgba(15,23,42,0.85)",
              backdropFilter: "blur(28px)",
              WebkitBackdropFilter: "blur(28px)",
              border: "1px solid rgba(255,255,255,0.1)",
              boxShadow: "0 24px 60px rgba(0,0,0,0.5)",
            }}
          >
            {/* City suggestions */}
            {suggestions.length > 0 && (
              <div className="p-2">
                <p className="px-3 pt-1 pb-2 text-[11px] text-white/30 uppercase tracking-widest font-semibold">
                  Suggestions
                </p>
                {suggestions.map((s, i) => (
                  <motion.button
                    key={i}
                    initial={{ opacity: 0, x: -6 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.04 }}
                    onMouseDown={() =>
                      handleSubmit(`${s.name}${s.state ? `, ${s.state}` : ""}, ${s.country}`)
                    }
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-white/8 text-left transition-colors group"
                  >
                    <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-white/5 flex-shrink-0">
                      <Search className="w-3.5 h-3.5 text-white/40" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-white text-sm font-semibold truncate">{s.name}</p>
                      <p className="text-white/35 text-xs mt-0.5">
                        {s.state ? `${s.state} · ` : ""}{s.country}
                      </p>
                    </div>
                    <span className="text-white/20 text-xs font-mono hidden group-hover:block">
                      ↵
                    </span>
                  </motion.button>
                ))}
              </div>
            )}

            {/* Separator */}
            {suggestions.length > 0 && recentSearches.length > 0 && !query && (
              <div className="mx-3 h-px bg-white/5" />
            )}

            {/* Recent searches */}
            {!query && recentSearches.length > 0 && (
              <div className="p-2">
                <div className="flex items-center justify-between px-3 pt-1 pb-2">
                  <p className="text-[11px] text-white/30 uppercase tracking-widest font-semibold">
                    Recent
                  </p>
                  <button
                    onMouseDown={() => { removeRecentSearch(""); setRecentSearches([]); }}
                    className="text-[11px] text-white/25 hover:text-white/60 transition-colors"
                  >
                    Clear all
                  </button>
                </div>
                {recentSearches.map((city, i) => (
                  <motion.button
                    key={i}
                    initial={{ opacity: 0, x: -6 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.04 }}
                    onMouseDown={() => handleSubmit(city)}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-white/8 text-left transition-colors group"
                  >
                    <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-white/5 flex-shrink-0">
                      <Clock className="w-3.5 h-3.5 text-white/40" />
                    </div>
                    <span className="flex-1 text-white/70 text-sm font-medium truncate">{city}</span>
                    <button
                      onMouseDown={(e) => handleRemoveRecent(city, e)}
                      className="opacity-0 group-hover:opacity-100 w-6 h-6 flex items-center justify-center rounded-full hover:bg-white/10 text-white/30 hover:text-white/70 transition-all"
                      aria-label="Remove"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </motion.button>
                ))}
              </div>
            )}

            {/* Empty query hint */}
            {query.length >= 2 && suggestions.length === 0 && !isSuggestionsLoading && (
              <div className="flex flex-col items-center gap-1 py-6 px-4 text-center">
                <TrendingUp className="w-5 h-5 text-white/20 mb-1" />
                <p className="text-white/40 text-sm">No results for &quot;{query}&quot;</p>
                <p className="text-white/20 text-xs">Press Enter to search anyway</p>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
