import { Location } from '../domain/Location.js';

export class IpGeocodingRepository {
  constructor(apiClient) {
    this.apiClient = apiClient;
    this.url = 'https://ipapi.co/json/';
  }

  async getCurrentLocation() {
    const data = await this.apiClient.get(this.url, {});

    const name = data?.city;
    if (!data || !name) return null;

    return new Location({
      id: null,
      name,
      latitude: data.latitude,
      longitude: data.longitude,
      country: data.country_name ?? '',
      countryCode: data.country_code ?? '',
      admin1: data.region ?? '',
      timezone: data.timezone ?? 'auto',
      elevation: null
    });
  }
}