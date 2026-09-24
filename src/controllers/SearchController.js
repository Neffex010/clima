import { ENV } from '../config/env.js';

export class SearchController {
  constructor({ locationService, events }) {
    this.locationService = locationService;
    this.events = events;
  }

  async search(query) {
    const term = (query ?? '').trim();
    if (term.length < 2) return [];

    this.events.emit('search:start', term);
    try {
      const results = await this.locationService.search(term);
      this.events.emit('search:results', results);
      return results;
    } catch (error) {
      this.events.emit('search:error', error);
      return [];
    }
  }

  async selectDefault(name = ENV.defaultCity) {
    const results = await this.search(name);
    if (results.length) this.select(results[0]);
  }

  select(location) {
    this.events.emit('city:selected', location);
  }
}