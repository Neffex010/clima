import { ENV } from '../config/env.js';
import { API_CONFIG } from '../config/api.config.js';
import { ClimateRecord } from '../domain/ClimateRecord.js';

export class ArchiveRepository {
  constructor(apiClient) {
    this.apiClient = apiClient;
    this.url = `${ENV.archiveBaseUrl}${API_CONFIG.archive.path}`;
  }

  async fetch(location, { startDate, endDate }) {
    const data = await this.apiClient.get(this.url, {
      params: {
        latitude: location.latitude,
        longitude: location.longitude,
        start_date: startDate,
        end_date: endDate,
        daily: API_CONFIG.archive.dailyVariables.join(','),
        timezone: 'auto'
      }
    });

    return ClimateRecord.fromApi(data.daily);
  }
}