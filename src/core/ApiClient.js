import { ApiError } from './ApiError.js';
import { ENV } from '../config/env.js';
import { CacheService } from '../data/CacheService.js';

export class ApiClient {
  constructor() {
    this.cache = new CacheService({ ttl: ENV.cacheTtl });
  }

  async get(url, { params = {}, cacheKey = null, ttl = ENV.cacheTtl, skipCache = false } = {}) {
    const queryString = this.buildQueryString(params);
    const fullUrl = queryString ? `${url}?${queryString}` : url;
    const key = cacheKey ?? fullUrl;

    if (!skipCache) {
      const cached = this.cache.get(key);
      if (cached != null) return cached;
    }

    const data = await this.request(fullUrl);
    this.cache.set(key, data, ttl);
    return data;
  }

  async request(url) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), ENV.requestTimeout);
    try {
      const response = await fetch(url, {
        signal: controller.signal,
        headers: { Accept: 'application/json' }
      });
      if (!response.ok) {
        throw ApiError.http(response, `El servidor respondió con el estado ${response.status}.`);
      }
      const data = await response.json();
      if (data && data.error) {
        throw ApiError.remote(data.reason ?? 'La API devolvió un error.');
      }
      return data;
    } catch (error) {
      if (error.name === 'AbortError') throw ApiError.timeout(url);
      if (error.isApiError) throw error;
      throw ApiError.network(url, error);
    } finally {
      clearTimeout(timer);
    }
  }

  buildQueryString(params) {
    const entries = Object.entries(params).filter(
      ([, value]) => value !== undefined && value !== null && value !== ''
    );
    if (!entries.length) return '';
    return new URLSearchParams(
      entries.map(([key, value]) => [key, Array.isArray(value) ? value.join(',') : String(value)])
    ).toString();
  }
}