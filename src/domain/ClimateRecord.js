export class ClimateRecord {
  constructor({ date, weatherCode, tempMax, tempMin, precipitation }) {
    this.date = date;
    this.weatherCode = weatherCode;
    this.tempMax = tempMax;
    this.tempMin = tempMin;
    this.precipitation = precipitation;
  }

  static fromApi(daily) {
    return (daily.time ?? []).map(
      (date, i) =>
        new ClimateRecord({
          date,
          weatherCode: daily.weather_code[i],
          tempMax: daily.temperature_2m_max[i],
          tempMin: daily.temperature_2m_min[i],
          precipitation: daily.precipitation_sum[i]
        })
    );
  }
}