import { EventBus } from './EventBus.js';
import { Store } from './Store.js';
import { ApiClient } from './ApiClient.js';
import { GeocodingRepository } from '../data/GeocodingRepository.js';
import { ForecastRepository } from '../data/ForecastRepository.js';
import { ArchiveRepository } from '../data/ArchiveRepository.js';
import { LocationService } from '../services/LocationService.js';
import { WeatherService } from '../services/WeatherService.js';
import { ClimateService } from '../services/ClimateService.js';
import { ExportService } from '../services/ExportService.js';
import { SearchController } from '../controllers/SearchController.js';
import { ForecastController } from '../controllers/ForecastController.js';
import { ClimateController } from '../controllers/ClimateController.js';
import { SearchBar } from '../ui/components/SearchBar.js';
import { Spinner } from '../ui/components/Spinner.js';
import { Toast } from '../ui/components/Toast.js';
import { HomeView } from '../ui/views/HomeView.js';
import { ClimateView } from '../ui/views/ClimateView.js';
import { ENV } from '../config/env.js';
import { qs } from '../utils/dom.js';

export class App {
  constructor(root) {
    this.root = root;
    this.events = new EventBus();
    this.store = new Store({
      location: null,
      bundle: null,
      forecastLoading: false,
      climate: null,
      climateRange: 30,
      climateLoading: false
    });

    const apiClient = new ApiClient();

    this.services = {
      location: new LocationService(new GeocodingRepository(apiClient)),
      weather: new WeatherService(new ForecastRepository(apiClient)),
      climate: new ClimateService(new ArchiveRepository(apiClient)),
      export: new ExportService()
    };

    this.controllers = {
      search: new SearchController({ locationService: this.services.location, events: this.events }),
      forecast: new ForecastController({ weatherService: this.services.weather, store: this.store, events: this.events }),
      climate: new ClimateController({ climateService: this.services.climate, store: this.store, events: this.events })
    };

    this.bindGlobalErrors();
  }

  bindGlobalErrors() {
    ['search:error', 'forecast:error', 'climate:error'].forEach((name) => {
      this.events.on(name, (error) => {
        console.error(error);
        this.events.emit('app:toast', { type: 'error', message: error?.message ?? 'Ocurrió un error inesperado.' });
      });
    });
  }

  start() {
    this.renderShell();

    this.spinner = new Spinner({ store: this.store });
    this.spinner.mount(qs('#spinner', this.root));

    this.toast = new Toast({ events: this.events });
    this.toast.mount(qs('#toasts', this.root));

    this.searchBar = new SearchBar({
      onSubmitSearch: (query) => this.controllers.search.search(query),
      onSelect: (location) => this.controllers.search.select(location)
    });
    this.searchBar.mount(qs('#search-bar', this.root));

    this.views = {
      home: new HomeView({ store: this.store, exportService: this.services.export }),
      climate: new ClimateView({ store: this.store, events: this.events, exportService: this.services.export })
    };
    this.views.home.mount(qs('#home-view', this.root));
    this.views.climate.mount(qs('#climate-view', this.root));

    this.bindNavigation();
    this.controllers.search.selectDefault(ENV.defaultCity);
  }

  renderShell() {
    this.root.innerHTML = `
      <header class="app-header">
        <div class="app-nav">
          <div class="brand">
            <span class="brand-mark" aria-hidden="true">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round">
                <circle cx="12" cy="12" r="4.4"/>
                <path d="M12 2v2.6M12 19.4V22M2 12h2.6M19.4 12H22M4.9 4.9l1.9 1.9M17.2 17.2l1.9 1.9M4.9 19.1l1.9-1.9M17.2 6.8l1.9-1.9"/>
              </svg>
            </span>
            <span class="brand-text">Clima<em>Global</em></span>
          </div>
          <div class="masthead-meta">
            <span class="masthead-kicker">Boletín meteorológico</span>
            <time class="masthead-date" id="masthead-date"></time>
          </div>
        </div>
        <nav class="nav-links" aria-label="Navegación principal">
          <button class="nav-link is-active" type="button" data-view="home"><span class="nav-num">01</span>El tiempo ahora</button>
          <button class="nav-link" type="button" data-view="climate"><span class="nav-num">02</span>Clima histórico</button>
        </nav>
        <div id="search-bar"></div>
      </header>
      <main class="app-main">
        <section id="home-view" class="view"></section>
        <section id="climate-view" class="view" hidden></section>
      </main>
      <div id="spinner"></div>
      <div id="toasts"></div>
    `;

    const dateEl = qs('#masthead-date', this.root);
    if (dateEl) {
      dateEl.textContent = new Intl.DateTimeFormat('es-ES', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      })
        .format(new Date())
        .replace(/\./g, '')
        .toUpperCase();
    }
  }

  bindNavigation() {
    this.root.querySelectorAll('.nav-link').forEach((button) => {
      button.addEventListener('click', () => this.switchView(button.dataset.view));
    });
  }

  switchView(name) {
    if (!['home', 'climate'].includes(name)) return;
    const home = qs('#home-view', this.root);
    const climate = qs('#climate-view', this.root);
    home.hidden = name !== 'home';
    climate.hidden = name !== 'climate';
    this.root.querySelectorAll('.nav-link').forEach((button) => {
      button.classList.toggle('is-active', button.dataset.view === name);
    });
  }
}