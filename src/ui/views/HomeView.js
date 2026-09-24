import { BaseComponent } from '../components/BaseComponent.js';
import { CurrentCard } from '../components/CurrentCard.js';
import { ForecastList } from '../components/ForecastList.js';
import { qs } from '../../utils/dom.js';

export class HomeView extends BaseComponent {
  constructor({ store, exportService }) {
    super({ store });
    this.exportService = exportService;
  }

  mount(container) {
    this.root = container;
    this.root.innerHTML = `
      <div class="home-grid">
        <div class="current-slot"></div>
        <div class="forecast-slot"></div>
      </div>
    `;

    this.currentCard = new CurrentCard({ store: this.store });
    this.forecastList = new ForecastList({ store: this.store, exportService: this.exportService });

    this.currentCard.mount(qs('.current-slot', this.root));
    this.forecastList.mount(qs('.forecast-slot', this.root));
  }
}