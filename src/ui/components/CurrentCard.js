import { BaseComponent } from './BaseComponent.js';
import { clearNode, escapeHtml } from '../../utils/dom.js';
import { capitalize, formatDirection, formatPercent, formatPrecipitation, formatPressure, formatTemperature, formatWind } from '../../utils/format.js';
import { formatDateLong } from '../../utils/date.js';
import { weatherIcon, weatherLabel } from '../../utils/weatherCodes.js';

export class CurrentCard extends BaseComponent {
  constructor({ store }) {
    super({ store });
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

    const { location, bundle } = this.store.get();
    if (!location || !bundle || !bundle.current) {
      this.root.innerHTML = `
        <div class="card current-card current-card-empty">
          <p class="empty-hint">Busca una ciudad para ver el clima actual.</p>
        </div>
      `;
      return;
    }

    const current = bundle.current;
    const tempText =
      current.temperature != null ? String(Math.round(current.temperature)) : '--';

    this.root.innerHTML = `
      <article class="card current-card">
        <header class="current-head">
          <div>
            <span class="current-kicker">Estación</span>
            <h2 class="current-place">${escapeHtml(location.name)}</h2>
            <p class="current-sub">${escapeHtml([location.admin1, location.country].filter(Boolean).join(', '))}</p>
            <p class="current-date">${formatDateLong(current.time)}</p>
          </div>
          <div class="current-icon" aria-hidden="true">${weatherIcon(current.weatherCode, 72)}</div>
        </header>
        <div class="current-main">
          <span class="current-temp${current.temperature == null ? ' is-na' : ''}">${tempText}</span>
          <span class="current-desc">${escapeHtml(capitalize(weatherLabel(current.weatherCode)))}</span>
        </div>
        <dl class="current-metrics">
          <div class="metric"><dt>Sensación</dt><dd>${formatTemperature(current.apparentTemperature)}</dd></div>
          <div class="metric"><dt>Máx / mín hoy</dt><dd>${formatTemperature(bundle.daily?.[0]?.tempMax)} / ${formatTemperature(bundle.daily?.[0]?.tempMin)}</dd></div>
          <div class="metric"><dt>Humedad</dt><dd>${formatPercent(current.humidity)}</dd></div>
          <div class="metric"><dt>Precipitación</dt><dd>${formatPrecipitation(current.precipitation)}</dd></div>
          <div class="metric"><dt>Viento</dt><dd>${formatWind(current.windSpeed)} ${formatDirection(current.windDirection)}</dd></div>
          <div class="metric"><dt>Presión</dt><dd>${formatPressure(current.surfacePressure)}</dd></div>
        </dl>
      </article>
    `;
  }
}