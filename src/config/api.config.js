export const API_CONFIG = {
  forecast: {
    path: '/forecast',
    currentVariables: [
      'temperature_2m',
      'apparent_temperature',
      'relative_humidity_2m',
      'precipitation',
      'weather_code',
      'wind_speed_10m',
      'wind_direction_10m',
      'surface_pressure',
      'uv_index'
    ],
    dailyVariables: [
      'weather_code',
      'temperature_2m_max',
      'temperature_2m_min',
      'precipitation_sum',
      'precipitation_probability_max',
      'wind_speed_10m_max'
    ],
    forecastDays: 7
  },
  archive: {
    path: '/archive',
    dailyVariables: ['weather_code', 'temperature_2m_max', 'temperature_2m_min', 'precipitation_sum'],
    defaultRangeDays: 30,
    maxRangeDays: 90,
    ranges: [7, 14, 30, 90]
  },
  geocoding: {
    path: '/search',
    count: 8,
    language: 'es'
  }
};