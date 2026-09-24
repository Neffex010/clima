const positiveNumber = (value, fallback) => {
  const n = Number(value);
  return Number.isFinite(n) && n > 0 ? n : fallback;
};

const env = import.meta.env ?? {};

export const ENV = {
  forecastBaseUrl: env.VITE_FORECAST_URL || 'https://api.open-meteo.com/v1',
  geocodingBaseUrl: env.VITE_GEOCODING_URL || 'https://geocoding-api.open-meteo.com/v1',
  archiveBaseUrl: env.VITE_ARCHIVE_URL || 'https://archive-api.open-meteo.com/v1',
  requestTimeout: positiveNumber(env.VITE_REQUEST_TIMEOUT, 10000),
  cacheTtl: positiveNumber(env.VITE_CACHE_TTL, 600000),
  defaultCity: env.VITE_DEFAULT_CITY || 'Madrid',
  isDev: Boolean(env.DEV)
};