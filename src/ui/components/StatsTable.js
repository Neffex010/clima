import { BaseComponent } from './BaseComponent.js';
import { clearNode, escapeHtml } from '../../utils/dom.js';
import { formatDateShort } from '../../utils/date.js';
import { formatDegrees, formatNumber, formatPrecipitation, formatSigned, formatTemperature } from '../../utils/format.js';

export class StatsTable extends BaseComponent {
  constructor({ store }) {
    super({ store });
  }

  mount(container) {
    this.root = container;
    this.subscribeToStore('climate', () => this.render());
    this.render();
  }

  render() {
    if (!this.root) return;
    clearNode(this.root);

    const { climate } = this.store.get();
    if (!climate || !climate.summary) {
      this.root.innerHTML = `
        <section class="card stat-table-card">
          <h2 class="card-title">Resumen estadístico</h2>
          <p class="empty-hint">Los datos estadísticos aparecerán aquí.</p>
        </section>
      `;
      return;
    }

    const s = climate.summary;
    const items = [
      ['Días analizados', s.rangeDays],
      ['Temp media máxima', formatTemperature(s.avgTempMax)],
      ['Temp media mínima', formatTemperature(s.avgTempMin)],
      ['Máxima registrada', `${formatTemperature(s.maxTempMax)} (${formatDateShort(s.hottestDay)})`],
      ['Mínima registrada', `${formatTemperature(s.minTempMin)} (${formatDateShort(s.coldestDay)})`],
      ['Rango medio diario', formatDegrees(s.meanDailyRange)],
      ['Desviación estándar', `± ${formatNumber(s.stddevTempMax, 1)}°C`],
      ['Precipitación total', formatPrecipitation(s.totalPrecipitation)],
      ['Precipitación media', formatPrecipitation(s.avgPrecipitation)],
      ['Días lluviosos', `${s.rainyDays} de ${s.rangeDays}`],
      ['Días secos', `${s.dryDays} de ${s.rangeDays}`],
      ['Tendencia máx. (por día)', formatSigned(s.trendSlopeTempMax, '°C')],
      ['Tendencia mín. (por día)', formatSigned(s.trendSlopeTempMin, '°C')]
    ];

    this.root.innerHTML = `
      <section class="card stat-table-card">
        <h2 class="card-title">Resumen estadístico</h2>
        <div class="stat-grid"></div>
      </section>
    `;
    const grid = this.root.querySelector('.stat-grid');
    items.forEach(([label, value]) => {
      const item = document.createElement('div');
      item.className = 'stat-item';
      item.innerHTML = `<span class="stat-label">${escapeHtml(label)}</span><span class="stat-value">${escapeHtml(value)}</span>`;
      grid.appendChild(item);
    });
  }
}