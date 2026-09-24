import { EventBus } from './EventBus.js';

export class Store {
  constructor(initialState = {}) {
    this.state = { ...initialState };
    this.events = new EventBus();
  }

  get(key) {
    return key === undefined ? this.state : this.state[key];
  }

  set(key, value) {
    if (this.state[key] === value) return;
    this.state[key] = value;
    this.events.emit('change', { key, value });
    this.events.emit(`change:${key}`, value);
  }

  update(partial) {
    const keys = Object.keys(partial);
    for (const key of keys) {
      const value = partial[key];
      if (this.state[key] !== value) {
        this.state[key] = value;
        this.events.emit(`change:${key}`, value);
      }
    }
    this.events.emit('change', { keys });
  }

  onChange(key, handler) {
    const eventName = key === undefined ? 'change' : `change:${key}`;
    return this.events.on(eventName, handler);
  }
}