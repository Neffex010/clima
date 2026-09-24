import { ENV } from '../config/env.js';

const GEOLOCATION_TIMEOUT = 10000;

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

  async detectLocation() {
    this.events.emit('app:toast', { type: 'info', message: 'Detectando tu ubicación…' });

    if (!navigator.geolocation) {
      this.events.emit('app:toast', {
        type: 'warning',
        message: 'Tu navegador no soporta geolocalización. Usando ciudad por defecto.'
      });
      return this.selectDefault();
    }

    let position;
    try {
      position = await this.getCurrentPosition();
    } catch {
      this.events.emit('app:toast', {
        type: 'warning',
        message: 'No se pudo acceder a tu ubicación. Usando ciudad por defecto.'
      });
      return this.selectDefault();
    }

    try {
      const location = await this.locationService.geocodeByCoordinates(
        position.coords.latitude,
        position.coords.longitude
      );
      if (location) {
        this.select(location);
      } else {
        this.events.emit('app:toast', { type: 'info', message: 'No se encontró tu zona. Usando ciudad por defecto.' });
        return this.selectDefault();
      }
    } catch {
      this.events.emit('app:toast', { type: 'info', message: 'Usando ciudad por defecto.' });
      return this.selectDefault();
    }
  }

  getCurrentPosition() {
    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(resolve, reject, {
        enableHighAccuracy: false,
        maximumAge: 5 * 60 * 1000,
        timeout: GEOLOCATION_TIMEOUT
      });
    });
  }

  select(location) {
    this.events.emit('city:selected', location);
  }
}