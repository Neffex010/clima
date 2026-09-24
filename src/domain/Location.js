export class Location {
  constructor({ id, name, latitude, longitude, country, countryCode, admin1, timezone, elevation }) {
    this.id = id ?? null;
    this.name = name;
    this.latitude = latitude;
    this.longitude = longitude;
    this.country = country ?? '';
    this.countryCode = countryCode ?? '';
    this.admin1 = admin1 ?? '';
    this.timezone = timezone ?? 'auto';
    this.elevation = elevation ?? null;
  }

  static fromGeocodingResult(result) {
    return new Location({
      id: result.id,
      name: result.name,
      latitude: result.latitude,
      longitude: result.longitude,
      country: result.country,
      countryCode: result.country_code,
      admin1: result.admin1,
      timezone: result.timezone,
      elevation: result.elevation
    });
  }

  get label() {
    return [this.name, this.admin1, this.country].filter(Boolean).join(', ');
  }

  get slug() {
    return this.name
      .trim()
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/\s+/g, '-')
      .replace(/[^a-z0-9-]/g, '');
  }
}