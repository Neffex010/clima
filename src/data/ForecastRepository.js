import { ENV } from '../config/env.js';
import { API_CONFIG } from '../config/api.config.js';
import { CurrentWeather } from '../domain/CurrentWeather.js';
import { DailyForecast } from '../domain/DailyForecast.js';

export class ForecastRepository {
  constructor(apiClient) {
    this.apiClient = apiClient;
    this.url = `${ENV.forecastBaseUrl}${API_CONFIG.forecast.path}`;
  }

  async fetch(location, { forecastDays = API_CONFIG.forecast.forecastDays } = {}) {
    const data = await this.apiClient.get(this.url, {
      params: {
        latitude: location.latitude,
        longitude: location.longitude,
        current: API_CONFIG.forecast.currentVariables.join(','),
        daily: API_CONFIG.forecast.dailyVariables.join(','),
        forecast_days: forecastDays,
        timezone: 'auto'
      }
    });

    return {
      current: CurrentWeather.fromApi(data.current),
      daily: DailyForecast.fromApi(data.daily),
      timezone: data.timezone,
      utcOffsetSeconds: data.utc_offset_seconds
    };
  }
}