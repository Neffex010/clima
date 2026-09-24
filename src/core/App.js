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
        <nav class="app-nav" aria-label="Navegación principal">
          <span class="brand">Clima Global</span>
          <div class="nav-links">
            <button class="nav-link is-active" type="button" data-view="home">Inicio</button>
            <button class="nav-link" type="button" data-view="climate">Clima histórico</button>
          </div>
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