export class CacheService {
  constructor({ ttl = 600000 } = {}) {
    this.ttl = ttl;
    this.memory = new Map();
  }

  get(key) {
    const entry = this.memory.get(key);
    if (!entry) return null;
    if (entry.expiresAt < Date.now()) {
      this.memory.delete(key);
      return null;
    }
    return entry.value;
  }

  set(key, value, ttl = this.ttl) {
    this.memory.set(key, { value, expiresAt: Date.now() + ttl });
    return value;
  }

  has(key) {
    return this.get(key) !== null;
  }

  delete(key) {
    this.memory.delete(key);
  }

  clear() {
    this.memory.clear();
  }

  get size() {
    return this.memory.size;
  }
}