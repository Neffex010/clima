export class WeatherBundle {
  constructor({ current, daily, timezone, utcOffsetSeconds }) {
    this.current = current;
    this.daily = daily;
    this.timezone = timezone ?? 'auto';
    this.utcOffsetSeconds = utcOffsetSeconds ?? 0;
  }

  static fromData({ current, daily, timezone, utcOffsetSeconds }) {
    return new WeatherBundle({ current, daily, timezone, utcOffsetSeconds });
  }
}