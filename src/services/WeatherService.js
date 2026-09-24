import { WeatherBundle } from '../domain/WeatherBundle.js';

export class WeatherService {
  constructor(forecastRepository) {
    this.repository = forecastRepository;
  }

  async getBundle(location) {
    const data = await this.repository.fetch(location);
    return WeatherBundle.fromData(data);
  }
}