export class LocationService {
  constructor(geocodingRepository, reverseGeocodingRepository, ipGeocodingRepository) {
    this.repository = geocodingRepository;
    this.reverseRepository = reverseGeocodingRepository;
    this.ipRepository = ipGeocodingRepository;
  }

  async search(query) {
    return this.repository.search(query);
  }

  async geocodeByName(name) {
    const results = await this.search(name);
    return results[0] ?? null;
  }

  async geocodeByCoordinates(latitude, longitude) {
    if (!this.reverseRepository) return null;
    const results = await this.reverseRepository.searchByCoordinates(latitude, longitude);
    return results[0] ?? null;
  }

  async getLocationByIp() {
    if (!this.ipRepository) return null;
    return this.ipRepository.getCurrentLocation();
  }
}