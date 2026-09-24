import { BaseComponent } from './BaseComponent.js';
import { createElement } from '../../utils/dom.js';

const MAX_VISIBLE_TOASTS = 4;
const TOAST_DURATION = 3500;

export class Toast extends BaseComponent {
  constructor({ events }) {
    super({ events });
  }

  mount(container) {
    this.root = container;
    this.subscribeToEvent('app:toast', ({ type = 'info', message }) => this.show(type, message));
  }

  show(type, message) {
    if (!this.root || !message) return;

    while (this.root.children.length >= MAX_VISIBLE_TOASTS) {
      this.root.firstChild?.remove();
    }

    const toast = createElement('div', { className: `toast toast-${type}`, text: message });
    toast.setAttribute('role', type === 'error' ? 'alert' : 'status');
    this.root.appendChild(toast);

    requestAnimationFrame(() => toast.classList.add('is-visible'));

    setTimeout(() => {
      toast.classList.remove('is-visible');
      setTimeout(() => toast.remove(), 300);
    }, TOAST_DURATION);
  }
}