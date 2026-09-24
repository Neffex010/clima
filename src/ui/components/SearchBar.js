import { BaseComponent } from './BaseComponent.js';
import { debounce } from '../../utils/debounce.js';
import { clearNode, createElement, escapeHtml, qs, qsa } from '../../utils/dom.js';

export class SearchBar extends BaseComponent {
  constructor({ onSubmitSearch, onSelect, minChars = 2, debounceMs = 350 }) {
    super();
    this.onSubmitSearch = onSubmitSearch;
    this.onSelect = onSelect;
    this.minChars = minChars;
    this.debounceMs = debounceMs;
    this.results = [];
    this.activeIndex = -1;
    this.pending = false;
  }

  mount(container) {
    this.root = container;
    this.root.innerHTML = `
      <div class="search">
        <svg class="search-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true">
          <circle cx="11" cy="11" r="7"/><path d="m21 21-4.3-4.3"/>
        </svg>
        <input
          class="search-input"
          type="search"
          placeholder="Buscar ciudad…"
          autocomplete="off"
          autocapitalize="off"
          spellcheck="false"
          aria-label="Buscar ciudad"
        />
        <ul class="search-suggestions" role="listbox" hidden></ul>
      </div>
    `;

    this.input = qs('.search-input', this.root);
    this.listbox = qs('.search-suggestions', this.root);

    this.debouncedSearch = debounce((query) => this.run(query), this.debounceMs);

    this.input.addEventListener('input', () => {
      const query = this.input.value.trim();
      if (query.length < this.minChars) {
        this.close();
        return;
      }
      this.debouncedSearch(query);
    });

    this.input.addEventListener('keydown', (event) => this.onKeydown(event));
    this.input.addEventListener('focus', () => {
      if (this.results.length && this.listbox.hidden) this.open();
    });

    document.addEventListener('click', (event) => {
      if (!this.root.contains(event.target)) this.close();
    });
  }

  async run(query) {
    this.setPending(true);
    let results = [];
    try {
      results = await this.onSubmitSearch(query);
    } catch {
      results = [];
      this.close();
      return;
    }
    if (this.input.value.trim() !== query || !this.listbox) return;
    this.setPending(false);
    this.results = results;
    if (results.length) this.renderResults();
    else this.close();
  }

  setPending(pending) {
    clearNode(this.listbox);
    if (pending) {
      const item = createElement('li', {
        className: 'search-item search-item-pending',
        text: 'Buscando…'
      });
      this.listbox.appendChild(item);
      this.open(true);
      return;
    }
    this.listbox.hidden = true;
  }

  renderResults() {
    clearNode(this.listbox);
    this.results.forEach((location, index) => {
      const item = createElement('li', {
        className: 'search-item',
        attrs: { role: 'option', 'aria-selected': 'false', tabindex: '-1' },
        html: `
          <span class="search-item-primary">${escapeHtml(location.name)}</span>
          <span class="search-item-secondary">${escapeHtml(
            [location.admin1, location.country].filter(Boolean).join(', ')
          )}</span>
        `
      });
      item.addEventListener('mousedown', (event) => {
        event.preventDefault();
        this.pick(index);
      });
      item.addEventListener('mouseenter', () => this.highlight(index));
      this.listbox.appendChild(item);
    });
    this.open();
  }

  open(force = false) {
    if (!this.listbox.hidden && !force) return;
    this.listbox.hidden = false;
    this.input.setAttribute('aria-expanded', 'true');
  }

  close() {
    if (this.listbox) this.listbox.hidden = true;
    this.activeIndex = -1;
    if (this.input) this.input.setAttribute('aria-expanded', 'false');
  }

  highlight(index) {
    const items = qsa('.search-item', this.listbox);
    if (index < 0 || index >= items.length) return;
    items.forEach((element, i) => {
      const active = i === index;
      element.classList.toggle('is-active', active);
      element.setAttribute('aria-selected', String(active));
    });
    this.activeIndex = index;
    items[index]?.scrollIntoView({ block: 'nearest' });
  }

  onKeydown(event) {
    if (this.listbox.hidden || !this.results.length) return;
    const count = this.results.length;

    if (event.key === 'ArrowDown') {
      event.preventDefault();
      this.highlight((this.activeIndex + 1) % count);
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      this.highlight((this.activeIndex - 1 + count) % count);
    } else if (event.key === 'Enter') {
      event.preventDefault();
      if (this.activeIndex >= 0) this.pick(this.activeIndex);
    } else if (event.key === 'Escape') {
      this.close();
    }
  }

  pick(index) {
    const location = this.results[index];
    if (!location) return;
    this.input.value = location.name;
    this.close();
    this.results = [];
    this.onSelect?.(location);
  }
}