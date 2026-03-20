// localStorage utilities for recent searches persistence
const STORAGE_KEY = 'weatherapp_recent_searches';
const MAX_ITEMS = 6;

export function getRecentSearches(): string[] {
  if (typeof window === 'undefined') return [];
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

export function addRecentSearch(city: string): void {
  if (typeof window === 'undefined') return;
  try {
    const current = getRecentSearches();
    const filtered = current.filter((c) => c.toLowerCase() !== city.toLowerCase());
    const updated = [city, ...filtered].slice(0, MAX_ITEMS);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch {
    // Silently fail if localStorage is unavailable
  }
}

export function removeRecentSearch(city: string): void {
  if (typeof window === 'undefined') return;
  try {
    const current = getRecentSearches();
    const updated = current.filter((c) => c.toLowerCase() !== city.toLowerCase());
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch {
    // Silently fail
  }
}

export function clearRecentSearches(): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // Silently fail
  }
}
