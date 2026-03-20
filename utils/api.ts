// OpenWeather API calls
export interface AirQualityData {
  list: Array<{
    main: { aqi: number };
    components: {
      co: number;
      no: number;
      no2: number;
      o3: number;
      so2: number;
      pm2_5: number;
      pm10: number;
      nh3: number;
    };
    dt: number;
  }>;
}

export interface UVData {
  value: number;
  date_iso?: string;
}
import axios from 'axios';
import { WeatherData, ForecastData } from './helpers';

const API_KEY = process.env.NEXT_PUBLIC_WEATHER_API_KEY;
const BASE_URL = 'https://api.openweathermap.org/data/2.5';
const GEO_URL = 'https://api.openweathermap.org/geo/1.0';

if (!API_KEY) {
  console.warn('⚠️  NEXT_PUBLIC_WEATHER_API_KEY is not set. Add it to .env.local');
}

/**
 * Fetch current weather by city name
 */
export async function fetchWeatherByCity(city: string): Promise<WeatherData> {
  const res = await axios.get<WeatherData>(`${BASE_URL}/weather`, {
    params: {
      q: city,
      appid: API_KEY,
      units: 'metric',
    },
  });
  return res.data;
}

/**
 * Fetch current weather by coordinates
 */
export async function fetchWeatherByCoords(lat: number, lon: number): Promise<WeatherData> {
  const res = await axios.get<WeatherData>(`${BASE_URL}/weather`, {
    params: {
      lat,
      lon,
      appid: API_KEY,
      units: 'metric',
    },
  });
  return res.data;
}

/**
 * Fetch 5-day / 3-hour forecast by city name
 */
export async function fetchForecastByCity(city: string): Promise<ForecastData> {
  const res = await axios.get<ForecastData>(`${BASE_URL}/forecast`, {
    params: {
      q: city,
      appid: API_KEY,
      units: 'metric',
    },
  });
  return res.data;
}

/**
 * Fetch 5-day / 3-hour forecast by coordinates
 */
export async function fetchForecastByCoords(lat: number, lon: number): Promise<ForecastData> {
  const res = await axios.get<ForecastData>(`${BASE_URL}/forecast`, {
    params: {
      lat,
      lon,
      appid: API_KEY,
      units: 'metric',
    },
  });
  return res.data;
}

/**
 * Auto-complete / city suggestions
 */
export interface CitySuggestion {
  name: string;
  country: string;
  state?: string;
  lat: number;
  lon: number;
}

export async function fetchCitySuggestions(query: string): Promise<CitySuggestion[]> {
  if (!query || query.length < 2) return [];
  const res = await axios.get<CitySuggestion[]>(`${GEO_URL}/direct`, {
    params: {
      q: query,
      limit: 5,
      appid: API_KEY,
    },
  });
  return res.data;
}

/**
 * Get city name from coordinates (reverse geocoding)
 */
/**
 * Fetch Air Quality Index by coordinates
 */
export async function fetchAirQuality(lat: number, lon: number): Promise<AirQualityData> {
  const res = await axios.get<AirQualityData>(`${BASE_URL}/air_pollution`, {
    params: { lat, lon, appid: API_KEY },
  });
  return res.data;
}

/**
 * Fetch UV index by coordinates (current)
 */
export async function fetchUVIndex(lat: number, lon: number): Promise<number> {
  try {
    // OpenWeather 2.5 UV endpoint
    const res = await axios.get<{ value: number }>(`${BASE_URL}/uvi`, {
      params: { lat, lon, appid: API_KEY },
    });
    return res.data.value;
  } catch {
    return 0;
  }
}

/**
 * Get city name from coordinates (reverse geocoding)
 */
export async function fetchCityFromCoords(lat: number, lon: number): Promise<string> {
  const res = await axios.get<Array<{ name: string; country: string }>>(`${GEO_URL}/reverse`, {
    params: {
      lat,
      lon,
      limit: 1,
      appid: API_KEY,
    },
  });
  if (res.data.length > 0) {
    return `${res.data[0].name}, ${res.data[0].country}`;
  }
  return 'Unknown Location';
}
