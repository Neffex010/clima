export class ApiError extends Error {
  constructor(message, { status = null, code = 'API_ERROR', details = null } = {}) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.code = code;
    this.details = details;
    this.isApiError = true;
  }

  static http(response, message) {
    return new ApiError(message, { status: response.status, code: 'HTTP_ERROR' });
  }

  static timeout(url) {
    return new ApiError(`La petición excedió el tiempo de espera (${url})`, {
      code: 'TIMEOUT'
    });
  }

  static network(url, cause) {
    return new ApiError(`Error de red al consultar ${url}: ${cause.message}`, {
      code: 'NETWORK_ERROR',
      details: cause
    });
  }

  static remote(reason, details = null) {
    return new ApiError(reason ?? 'La API devolvió un error.', { code: 'REMOTE_ERROR', details });
  }
}