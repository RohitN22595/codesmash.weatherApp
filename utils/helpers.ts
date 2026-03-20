// Helper utility functions for the weather app

/**
 * Convert Kelvin to Celsius
 */
export function kelvinToCelsius(kelvin: number): number {
  return Math.round(kelvin - 273.15);
}

/**
 * Convert Celsius to Fahrenheit
 */
export function celsiusToFahrenheit(celsius: number): number {
  return Math.round((celsius * 9) / 5 + 32);
}

/**
 * Format temperature based on selected unit
 */
export function formatTemp(celsius: number, unit: 'C' | 'F'): string {
  if (unit === 'F') {
    return `${celsiusToFahrenheit(celsius)}°F`;
  }
  return `${celsius}°C`;
}

/**
 * Get weather icon URL from OpenWeather icon code
 */
export function getWeatherIconUrl(iconCode: string, size: '1x' | '2x' | '4x' = '2x'): string {
  return `https://openweathermap.org/img/wn/${iconCode}@${size}.png`;
}

/**
 * Convert Unix timestamp + timezone offset to a Date object
 */
export function unixToDate(unix: number, timezoneOffset: number = 0): Date {
  return new Date((unix + timezoneOffset) * 1000);
}

/**
 * Format a date to weekday name
 */
export function formatWeekday(date: Date): string {
  return date.toLocaleDateString('en-US', { weekday: 'short', timeZone: 'UTC' });
}

/**
 * Format a date to hour (12h format)
 */
export function formatHour(date: Date): string {
  return date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    hour12: true,
    timeZone: 'UTC',
  });
}

/**
 * Format wind speed in km/h from m/s
 */
export function formatWindSpeed(ms: number): string {
  return `${Math.round(ms * 3.6)} km/h`;
}

/**
 * Format visibility from meters to km
 */
export function formatVisibility(meters: number): string {
  if (meters >= 1000) {
    return `${(meters / 1000).toFixed(1)} km`;
  }
  return `${meters} m`;
}

/**
 * Get wind compass direction from degrees
 */
export function getWindDirection(degrees: number): string {
  const dirs = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
  return dirs[Math.round(degrees / 45) % 8];
}

/**
 * Group hourly forecast items by day
 */
export function groupByDay(items: ForecastItem[]): Record<string, ForecastItem[]> {
  const result: Record<string, ForecastItem[]> = {};
  items.forEach((item) => {
    const day = new Date(item.dt * 1000).toLocaleDateString('en-US', { weekday: 'short' });
    if (!result[day]) result[day] = [];
    result[day].push(item);
  });
  return result;
}

/**
 * Get the day representative forecast (noon or closest)
 */
export function getDayForecast(items: ForecastItem[]): ForecastItem {
  const noon = items.find((item) => {
    const hour = new Date(item.dt * 1000).getUTCHours();
    return hour >= 11 && hour <= 14;
  });
  return noon || items[Math.floor(items.length / 2)];
}

export interface ForecastItem {
  dt: number;
  main: {
    temp: number;
    feels_like: number;
    temp_min: number;
    temp_max: number;
    humidity: number;
    pressure: number;
  };
  weather: Array<{
    id: number;
    main: string;
    description: string;
    icon: string;
  }>;
  wind: {
    speed: number;
    deg: number;
  };
  visibility?: number;
  pop: number;
}

export interface WeatherData {
  name: string;
  sys: {
    country: string;
    sunrise: number;
    sunset: number;
  };
  coord: {
    lat: number;
    lon: number;
  };
  main: {
    temp: number;
    feels_like: number;
    temp_min: number;
    temp_max: number;
    humidity: number;
    pressure: number;
  };
  weather: Array<{
    id: number;
    main: string;
    description: string;
    icon: string;
  }>;
  wind: {
    speed: number;
    deg: number;
  };
  visibility: number;
  timezone: number;
  dt: number;
}

export interface ForecastData {
  list: ForecastItem[];
  city: {
    name: string;
    country: string;
    timezone: number;
    sunrise: number;
    sunset: number;
  };
}
