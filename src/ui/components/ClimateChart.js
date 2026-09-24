import { BaseComponent } from './BaseComponent.js';
import { formatDayMonth } from '../../utils/date.js';
import { formatTemperature } from '../../utils/format.js';

const PAD = { top: 28, right: 16, bottom: 32, left: 48 };

export class ClimateChart extends BaseComponent {
  constructor({ store, height = 260 }) {
    super({ store });
    this.height = height;
    this.ctx = null;
    this.onResizeBound = () => this.render();
  }

  mount(container) {
    this.root = container;
    this.canvas = document.createElement('canvas');
    this.root.appendChild(this.canvas);
    this.ctx = this.canvas.getContext('2d');
    this.subscribeToStore('climate', () => this.render());
    window.addEventListener('resize', this.onResizeBound);
    this.render();
  }

  destroy() {
    window.removeEventListener('resize', this.onResizeBound);
    super.destroy();
  }

  cssPixels() {
    return {
      width: this.canvas.width / (window.devicePixelRatio || 1),
      height: this.canvas.height / (window.devicePixelRatio || 1)
    };
  }

  render() {
    if (!this.root || !this.ctx) return;
    const { climate } = this.store.get();
    const records = climate?.records ?? [];

    const width = Math.max(280, this.root.clientWidth - 2);
    const ratio = window.devicePixelRatio || 1;
    this.canvas.width = Math.round(width * ratio);
    this.canvas.height = Math.round(this.height * ratio);
    this.canvas.style.width = `${width}px`;
    this.canvas.style.height = `${this.height}px`;
    this.ctx.setTransform(ratio, 0, 0, ratio, 0, 0);

    if (!records.length) {
      this.drawEmpty(climate?.loading);
      return;
    }
    this.draw(records);
  }

  drawEmpty(loading = false) {
    const { width, height } = this.cssPixels();
    const ctx = this.ctx;
    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = '#5a626e';
    ctx.font = '12px "IBM Plex Mono", ui-monospace, monospace';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(
      loading ? 'Cargando datos…' : 'Busca una ciudad para ver su evolución histórica.',
      width / 2,
      height / 2
    );
  }

  draw(records) {
    const { width, height } = this.cssPixels();
    const ctx = this.ctx;
    const plotWidth = width - PAD.left - PAD.right;
    const plotHeight = height - PAD.top - PAD.bottom;

    const temps = records.flatMap((record) => [record.tempMax, record.tempMin]).filter((v) => v != null);
    const minTemp = Math.floor(Math.min(...temps));
    const maxTemp = Math.ceil(Math.max(...temps));
    const span = maxTemp - minTemp || 1;

    const x = (i) => (records.length === 1 ? PAD.left + plotWidth / 2 : PAD.left + (i / (records.length - 1)) * plotWidth);
    const y = (value) => PAD.top + ((maxTemp - value) / span) * plotHeight;

    ctx.clearRect(0, 0, width, height);

    this.drawGrid(ctx, width, height, plotHeight, minTemp, maxTemp, span);
    this.drawPrecipitation(ctx, records, x, plotWidth, plotHeight);
    this.drawSeries(ctx, records, x, y, 'tempMax', '#cf4d17');
    this.drawSeries(ctx, records, x, y, 'tempMin', '#0d7a6c');
    this.drawTicks(ctx, records, x, height);
    this.drawLegend(ctx, width);
  }

  drawGrid(ctx, width, height, plotHeight, minTemp, maxTemp, span) {
    const steps = 4;
    ctx.strokeStyle = 'rgba(26, 35, 48, 0.14)';
    ctx.fillStyle = '#5a626e';
    ctx.font = '11px "IBM Plex Mono", ui-monospace, monospace';
    ctx.textAlign = 'right';
    ctx.textBaseline = 'middle';
    ctx.lineWidth = 1;

    for (let step = 0; step <= steps; step += 1) {
      const value = minTemp + (step / steps) * span;
      const yy = PAD.top + ((maxTemp - value) / span) * plotHeight;
      ctx.beginPath();
      ctx.moveTo(PAD.left, yy);
      ctx.lineTo(width - PAD.right, yy);
      ctx.stroke();
      ctx.fillText(String(Math.round(value)), PAD.left - 8, yy);
    }
  }

  drawPrecipitation(ctx, records, x, plotWidth, plotHeight) {
    const maxPrecip = Math.max(...records.map((record) => record.precipitation ?? 0));
    if (maxPrecip <= 0) return;

    const bandTop = PAD.top + plotHeight * 0.72;
    const bandBottom = PAD.top + plotHeight;
    const barWidth = Math.max(2, (plotWidth / records.length) * 0.5);

    ctx.fillStyle = 'rgba(47, 111, 179, 0.3)';
    records.forEach((record, i) => {
      const barHeight = ((record.precipitation ?? 0) / maxPrecip) * (bandBottom - bandTop);
      ctx.fillRect(x(i) - barWidth / 2, bandBottom - barHeight, barWidth, barHeight);
    });
  }

  drawSeries(ctx, records, x, y, accessor, color) {
    const visible = records.filter((record) => record[accessor] != null);
    if (!visible.length) return;

    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    ctx.lineJoin = 'round';
    ctx.lineCap = 'round';

    ctx.beginPath();
    records.forEach((record, i) => {
      const value = record[accessor];
      if (value == null) return;
      if (i === 0) ctx.moveTo(x(i), y(value));
      else ctx.lineTo(x(i), y(value));
    });
    ctx.stroke();

    ctx.fillStyle = color;
    records.forEach((record, i) => {
      if (record[accessor] == null) return;
      ctx.beginPath();
      ctx.arc(x(i), y(record[accessor]), 2.4, 0, Math.PI * 2);
      ctx.fill();
    });
  }

  drawTicks(ctx, records, x, height) {
    const every = Math.max(1, Math.ceil(records.length / 6));
    ctx.fillStyle = '#5a626e';
    ctx.font = '10px "IBM Plex Mono", ui-monospace, monospace';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';

    records.forEach((record, i) => {
      if (i % every !== 0 && i !== records.length - 1) return;
      ctx.fillText(formatDayMonth(record.date), x(i), height - PAD.bottom + 8);
    });
  }

  drawLegend(ctx, width) {
    const items = [
      { color: '#cf4d17', label: 'Máxima' },
      { color: '#0d7a6c', label: 'Mínima' },
      { color: 'rgba(47, 111, 179, 0.9)', label: 'Precipitación' }
    ];
    ctx.font = '11px "IBM Plex Mono", ui-monospace, monospace';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';
    ctx.lineWidth = 3;

    let cursor = PAD.left;
    items.forEach((item) => {
      ctx.strokeStyle = item.color;
      ctx.beginPath();
      ctx.moveTo(cursor, PAD.top / 2);
      ctx.lineTo(cursor + 18, PAD.top / 2);
      ctx.stroke();
      ctx.fillStyle = '#5a626e';
      ctx.fillText(item.label, cursor + 24, PAD.top / 2);
      cursor += 24 + ctx.measureText(item.label).width + 18;
    });
  }
}