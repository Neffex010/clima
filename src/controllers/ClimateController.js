import { API_CONFIG } from '../config/api.config.js';

export class ClimateController {
  constructor({ climateService, store, events }) {
    this.climateService = climateService;
    this.store = store;
    this.events = events;

    this.events.on('city:selected', (location) =>
      this.load(location, this.store.get('climateRange') ?? API_CONFIG.archive.defaultRangeDays)
    );
    this.events.on('climate:range', (days) => this.load(this.store.get('location'), days));
  }

  async load(location, days) {
    if (!location) return;

    this.store.update({ climate: null, climateRange: days, climateLoading: true });
    this.events.emit('climate:loading', true);

    try {
      const climate = await this.climateService.getSummary(location, days);
      this.store.update({ climate, climateLoading: false });
      this.events.emit('climate:loaded', climate);
    } catch (error) {
      this.store.set('climateLoading', false);
      this.events.emit('climate:error', error);
    }
  }
}