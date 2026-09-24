import { BaseComponent } from './BaseComponent.js';

export class Spinner extends BaseComponent {
  constructor({ store }) {
    super({ store });
  }

  mount(container) {
    this.root = container;
    container.innerHTML = `
      <div class="spinner" hidden>
        <span class="spinner-dot" aria-hidden="true"></span>
        <p class="spinner-text">Cargando datos…</p>
      </div>
    `;
    this.element = container.querySelector('.spinner');

    this.subscribeToStore('forecastLoading', () => this.refresh());
    this.subscribeToStore('climateLoading', () => this.refresh());
  }

  refresh() {
    if (!this.root || !this.element) return;
    const visible =
      Boolean(this.store.get('forecastLoading')) || Boolean(this.store.get('climateLoading'));
    this.element.hidden = !visible;
  }
}