export class ForecastController {
  constructor({ weatherService, store, events }) {
    this.weatherService = weatherService;
    this.store = store;
    this.events = events;

    this.events.on('city:selected', (location) => this.load(location));
  }

  async load(location) {
    if (!location) return;

    this.store.update({ location, bundle: null, forecastLoading: true });
    this.events.emit('forecast:loading', true);

    try {
      const bundle = await this.weatherService.getBundle(location);
      this.store.update({ bundle, forecastLoading: false });
      this.events.emit('forecast:loaded', bundle);
      this.events.emit('app:toast', { type: 'success', message: `Datos de ${location.label} actualizados.` });
    } catch (error) {
      this.store.set('forecastLoading', false);
      this.events.emit('forecast:error', error);
    }
  }
}