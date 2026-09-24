export class BaseComponent {
  constructor({ store = null, events = null } = {}) {
    this.store = store;
    this.events = events;
    this.root = null;
    this.disposers = [];
  }

  track(disposer) {
    if (typeof disposer === 'function') this.disposers.push(disposer);
    return disposer;
  }

  subscribeToStore(key, handler) {
    if (!this.store) return;
    this.track(this.store.onChange(key, handler));
  }

  subscribeToEvent(name, handler) {
    if (!this.events) return;
    this.track(this.events.on(name, handler));
  }

  destroy() {
    this.disposers.forEach((dispose) => dispose());
    this.disposers = [];
    this.root = null;
  }
}