export class CurrentWeather {
  constructor({
    time,
    temperature,
    apparentTemperature,
    humidity,
    precipitation,
    weatherCode,
    windSpeed,
    windDirection,
    surfacePressure,
    uvIndex,
    isDay
  }) {
    this.time = time;
    this.temperature = temperature;
    this.apparentTemperature = apparentTemperature;
    this.humidity = humidity;
    this.precipitation = precipitation;
    this.weatherCode = weatherCode;
    this.windSpeed = windSpeed;
    this.windDirection = windDirection;
    this.surfacePressure = surfacePressure;
    this.uvIndex = uvIndex;
    this.isDay = isDay;
  }

  static fromApi(data) {
    return new CurrentWeather({
      time: data.time,
      temperature: data.temperature_2m,
      apparentTemperature: data.apparent_temperature,
      humidity: data.relative_humidity_2m,
      precipitation: data.precipitation,
      weatherCode: data.weather_code,
      windSpeed: data.wind_speed_10m,
      windDirection: data.wind_direction_10m,
      surfacePressure: data.surface_pressure,
      uvIndex: data.uv_index,
      isDay: data.is_day === 1
    });
  }
}