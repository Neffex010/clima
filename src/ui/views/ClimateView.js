import { BaseComponent } from '../components/BaseComponent.js';
import { ClimateChart } from '../components/ClimateChart.js';
import { StatsTable } from '../components/StatsTable.js';
import { escapeHtml, qs } from '../../utils/dom.js';
import { API_CONFIG } from '../../config/api.config.js';

export class ClimateView extends BaseComponent {
  constructor({ store, events, exportService }) {
    super({ store, events });
    this.exportService = exportService;
  }

  mount(container) {
    this.root = container;
    this.root.innerHTML = `
      <div class="climate-head">
        <div>
          <h2 class="section-title">Clima histórico</h2>
          <p class="section-subtitle"></p>
        </div>
        <div class="climate-actions">
          <div class="range-selector" role="group" aria-label="Rango de días"></div>
          <button class="btn btn-export-climate" type="button">Datos (CSV)</button>
        </div>
      </div>
      <div class="chart-slot chart-climate">
        <div class="chart-head">
          <h3 class="chart-title">Evolución de temperaturas y precipitación</h3>
        </div>
        <div class="chart-canvas-slot"></div>
      </div>
      <div class="stat-table-slot"></div>
    `;

    this.placeEl = qs('.section-subtitle', this.root);
    this.rangeSelector = qs('.range-selector', this.root);
    this.exportButton = qs('.btn-export-climate', this.root);

    this.chart = new ClimateChart({ store: this.store });
    this.chart.mount(qs('.chart-canvas-slot', this.root));

    this.statTable = new StatsTable({ store: this.store });
    this.statTable.mount(qs('.stat-table-slot', this.root));

    this.subscribeToStore('location', () => this.renderHeader());
    this.subscribeToStore('climate', () => {
      this.renderHeader();
      this.exportButton.disabled = !this.store.get('climate');
    });
    this.subscribeToStore('climateRange', () => this.renderRangeButtons());
    this.subscribeToEvent('climate:range', () => this.toggleRangeButtons());

    this.renderHeader();
    this.renderRangeButtons();
    this.bindExport();

    this.exportButton.disabled = !this.store.get('climate');
  }

  renderHeader() {
    const { location, climate, climateRange } = this.store.get();
    if (!location) {
      this.placeEl.textContent = 'Busca una ciudad para ver su historial climático.';
      return;
    }
    const rangeLabel = climate?.records?.length ?? climateRange ?? API_CONFIG.archive.defaultRangeDays;
    this.placeEl.textContent = `${location.label} · últimos ${rangeLabel} días`;
  }

  renderRangeButtons() {
    const activeRange = this.store.get('climateRange') ?? API_CONFIG.archive.defaultRangeDays;
    this.rangeSelector.innerHTML = '';
    API_CONFIG.archive.ranges.forEach((days) => {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = `range-btn${days === activeRange ? ' is-active' : ''}`;
      button.dataset.days = String(days);
      button.textContent = days < 30 ? `${days} d` : `${days / 30} m`;
      button.addEventListener('click', () => this.events.emit('climate:range', days));
      this.rangeSelector.appendChild(button);
    });
  }

  toggleRangeButtons() {
    const activeRange = this.store.get('climateRange');
    this.rangeSelector.querySelectorAll('.range-btn').forEach((button) => {
      const active = Number(button.dataset.days) === activeRange;
      button.classList.toggle('is-active', active);
    });
  }

  bindExport() {
    this.exportButton.addEventListener('click', () => {
      const { location, climate } = this.store.get();
      try {
        this.exportService?.exportClimate(climate, location);
      } catch (error) {
        console.error(error);
      }
    });
  }

  destroy() {
    this.chart?.destroy();
    this.statTable?.destroy();
    super.destroy();
  }
}