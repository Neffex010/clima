export class LocationService {
  constructor(geocodingRepository) {
    this.repository = geocodingRepository;
  }

  async search(query) {
    return this.repository.search(query);
  }

  async geocodeByName(name) {
    const results = await this.search(name);
    return results[0] ?? null;
  }
}