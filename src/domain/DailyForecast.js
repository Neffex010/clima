export class DailyForecast {
  constructor({ date, weatherCode, tempMax, tempMin, precipitation, precipitationProbability, windSpeedMax }) {
    this.date = date;
    this.weatherCode = weatherCode;
    this.tempMax = tempMax;
    this.tempMin = tempMin;
    this.precipitation = precipitation;
    this.precipitationProbability = precipitationProbability;
    this.windSpeedMax = windSpeedMax;
  }

  static fromApi(daily) {
    return (daily.time ?? []).map(
      (date, i) =>
        new DailyForecast({
          date,
          weatherCode: daily.weather_code[i],
          tempMax: daily.temperature_2m_max[i],
          tempMin: daily.temperature_2m_min[i],
          precipitation: daily.precipitation_sum[i],
          precipitationProbability: daily.precipitation_probability_max[i],
          windSpeedMax: daily.wind_speed_10m_max[i]
        })
    );
  }
}