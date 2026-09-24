import { Location } from '../domain/Location.js';

export class ReverseGeocodingRepository {
  constructor(apiClient) {
    this.apiClient = apiClient;
    this.url = 'https://api.bigdatacloud.net/data/reverse-geocode-client';
  }

  async searchByCoordinates(latitude, longitude) {
    if (latitude == null || longitude == null) return [];

    const data = await this.apiClient.get(this.url, {
      params: { latitude, longitude, localityLanguage: 'es' }
    });

    const name = data?.city || data?.locality;
    if (!data || !name) return [];

    return [
      new Location({
        id: null,
        name,
        latitude: data.latitude,
        longitude: data.longitude,
        country: data.countryName ?? '',
        countryCode: data.countryCode ?? '',
        admin1: data.principalSubdivision ?? '',
        timezone: 'auto',
        elevation: null
      })
    ];
  }
}