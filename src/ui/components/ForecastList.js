import { BaseComponent } from './BaseComponent.js';
import { clearNode } from '../../utils/dom.js';
import { capitalize, formatPrecipitation, formatPercent, formatTemperature } from '../../utils/format.js';
import { formatDayMonth, formatWeekday, isToday } from '../../utils/date.js';
import { weatherIcon } from '../../utils/weatherCodes.js';

export class ForecastList extends BaseComponent {
  constructor({ store, exportService }) {
    super({ store });
    this.exportService = exportService;
  }

  mount(container) {
    this.root = container;
    this.subscribeToStore('bundle', () => this.render());
    this.subscribeToStore('location', () => this.render());
    this.render();
  }

  render() {
    if (!this.root) return;
    clearNode(this.root);

    const { bundle, location } = this.store.get();
    if (!bundle || !bundle.daily.length) {
      this.root.innerHTML = `
        <section class="card forecast-card">
          <h2 class="card-title">Pronóstico de 7 días</h2>
          <p class="empty-hint">Sin datos de pronóstico todavía.</p>
        </section>
      `;
      return;
    }

    this.root.innerHTML = `
      <section class="card forecast-card">
        <div class="card-head">
          <h2 class="card-title">Pronóstico a ${bundle.daily.length} días</h2>
          <button class="btn btn-export" type="button">Exportar CSV</button>
        </div>
        <ul class="forecast-list"></ul>
      </section>
    `;

    const list = this.root.querySelector('.forecast-list');
    const today = isToday(bundle.daily[0].date);

    bundle.daily.forEach((day, index) => {
      const isTodaysRow = index === 0 && today;
      const item = document.createElement('li');
      item.className = `forecast-day${isTodaysRow ? ' is-today' : ''}`;
      item.innerHTML = `
        <span class="forecast-day-name">${isTodaysRow ? 'Hoy' : capitalize(formatWeekday(day.date))}</span>
        <span class="forecast-day-date">${formatDayMonth(day.date)}</span>
        <span class="forecast-day-icon" aria-hidden="true">${weatherIcon(day.weatherCode, 34)}</span>
        <span class="forecast-day-temps">
          <strong>${formatTemperature(day.tempMax)}</strong>
          <span class="forecast-day-min">${formatTemperature(day.tempMin)}</span>
        </span>
        <span class="forecast-day-rain" title="Precipitación">${formatPrecipitation(day.precipitation)}</span>
        <span class="forecast-day-pop" title="Probabilidad de precipitación">
          ${day.precipitationProbability != null ? `${formatPercent(day.precipitationProbability)}` : ''}
        </span>
      `;
      list.appendChild(item);
    });

    const exportButton = this.root.querySelector('.btn-export');
    exportButton.addEventListener('click', () => {
      try {
        this.exportService?.exportForecast(bundle, location);
      } catch (error) {
        console.error(error);
      }
    });
  }
}