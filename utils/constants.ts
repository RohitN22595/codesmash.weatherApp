// Weather condition constants and API configuration
export const API_BASE_URL = 'https://api.openweathermap.org/data/2.5';
export const GEO_API_URL = 'https://api.openweathermap.org/geo/1.0';
export const ICON_URL = 'https://openweathermap.org/img/wn';

export const DEFAULT_CITY = 'New York';
export const MAX_RECENT_SEARCHES = 6;

// Weather condition to gradient mapping
export const WEATHER_GRADIENTS: Record<string, string> = {
  Clear: 'from-amber-400 via-orange-400 to-rose-400',
  Clouds: 'from-slate-500 via-slate-600 to-slate-700',
  Rain: 'from-blue-700 via-blue-600 to-indigo-700',
  Drizzle: 'from-blue-500 via-cyan-500 to-teal-500',
  Thunderstorm: 'from-gray-800 via-gray-700 to-indigo-900',
  Snow: 'from-blue-100 via-slate-200 to-indigo-200',
  Mist: 'from-gray-400 via-gray-500 to-slate-500',
  Smoke: 'from-gray-600 via-gray-700 to-gray-800',
  Haze: 'from-yellow-300 via-amber-400 to-orange-400',
  Dust: 'from-yellow-500 via-amber-600 to-orange-500',
  Fog: 'from-gray-300 via-gray-400 to-slate-400',
  Sand: 'from-yellow-400 via-amber-500 to-orange-400',
  Ash: 'from-gray-500 via-gray-600 to-gray-700',
  Squall: 'from-blue-600 via-indigo-600 to-purple-700',
  Tornado: 'from-gray-700 via-gray-800 to-gray-900',
};

// Dark mode gradient fallback
export const WEATHER_DARK_GRADIENTS: Record<string, string> = {
  Clear: 'from-amber-900 via-orange-900 to-rose-900',
  Clouds: 'from-slate-800 via-slate-900 to-gray-900',
  Rain: 'from-blue-950 via-indigo-950 to-slate-900',
  Drizzle: 'from-blue-900 via-cyan-950 to-teal-900',
  Thunderstorm: 'from-gray-950 via-gray-900 to-indigo-950',
  Snow: 'from-slate-700 via-slate-800 to-indigo-900',
  default: 'from-slate-900 via-gray-900 to-slate-800',
};

// Time-of-day backgrounds
export const TIME_GRADIENTS = {
  dawn: 'from-orange-300 via-pink-400 to-purple-600',
  morning: 'from-blue-400 via-sky-500 to-cyan-400',
  afternoon: 'from-sky-400 via-blue-500 to-indigo-400',
  evening: 'from-orange-500 via-rose-600 to-purple-700',
  night: 'from-indigo-950 via-slate-900 to-gray-950',
};

// Wind speed descriptions
export const WIND_DESCRIPTIONS = [
  { max: 2, label: 'Calm', icon: '🌬️' },
  { max: 6, label: 'Light Breeze', icon: '🍃' },
  { max: 12, label: 'Gentle Breeze', icon: '💨' },
  { max: 20, label: 'Moderate Breeze', icon: '🌀' },
  { max: 29, label: 'Fresh Breeze', icon: '🌪️' },
  { max: Infinity, label: 'Strong Wind', icon: '⛈️' },
];
