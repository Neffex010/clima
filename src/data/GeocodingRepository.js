import { ENV } from '../config/env.js';
import { API_CONFIG } from '../config/api.config.js';
import { Location } from '../domain/Location.js';

export class GeocodingRepository {
  constructor(apiClient) {
    this.apiClient = apiClient;
    this.url = `${ENV.geocodingBaseUrl}${API_CONFIG.geocoding.path}`;
  }

  async search(query) {
    const term = (query ?? '').trim();
    if (!term) return [];

    const data = await this.apiClient.get(this.url, {
      params: {
        name: term,
        count: API_CONFIG.geocoding.count,
        language: API_CONFIG.geocoding.language,
        format: 'json'
      }
    });

    return (data.results ?? []).map((result) => Location.fromGeocodingResult(result));
  }
}