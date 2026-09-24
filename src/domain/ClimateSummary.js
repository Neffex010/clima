import { mean, maxValue, minValue, standardDeviation, trendSlope } from '../utils/statistics.js';

const isTemp = (v) => v != null;

export class ClimateSummary {
  constructor({
    rangeDays,
    avgTempMax,
    avgTempMin,
    maxTempMax,
    minTempMin,
    hottestDay,
    coldestDay,
    meanDailyRange,
    stddevTempMax,
    totalPrecipitation,
    avgPrecipitation,
    rainyDays,
    dryDays,
    trendSlopeTempMax,
    trendSlopeTempMin
  }) {
    this.rangeDays = rangeDays;
    this.avgTempMax = avgTempMax;
    this.avgTempMin = avgTempMin;
    this.maxTempMax = maxTempMax;
    this.minTempMin = minTempMin;
    this.hottestDay = hottestDay;
    this.coldestDay = coldestDay;
    this.meanDailyRange = meanDailyRange;
    this.stddevTempMax = stddevTempMax;
    this.totalPrecipitation = totalPrecipitation;
    this.avgPrecipitation = avgPrecipitation;
    this.rainyDays = rainyDays;
    this.dryDays = dryDays;
    this.trendSlopeTempMax = trendSlopeTempMax;
    this.trendSlopeTempMin = trendSlopeTempMin;
  }

  static compute(records) {
    const tempMax = records.map((r) => r.tempMax).filter(isTemp);
    const tempMin = records.map((r) => r.tempMin).filter(isTemp);
    const precipitation = records.map((r) => r.precipitation ?? 0);
    const dailyRanges = records
      .filter((r) => isTemp(r.tempMax) && isTemp(r.tempMin))
      .map((r) => r.tempMax - r.tempMin);

    let hottest = null;
    let coldest = null;
    for (const record of records) {
      if (isTemp(record.tempMax) && (hottest === null || record.tempMax > hottest.tempMax)) {
        hottest = record;
      }
      if (isTemp(record.tempMin) && (coldest === null || record.tempMin < coldest.tempMin)) {
        coldest = record;
      }
    }

    const rainyDays = records.filter((r) => (r.precipitation ?? 0) > 0).length;

    return new ClimateSummary({
      rangeDays: records.length,
      avgTempMax: mean(tempMax),
      avgTempMin: mean(tempMin),
      maxTempMax: maxValue(tempMax),
      minTempMin: minValue(tempMin),
      hottestDay: hottest?.date ?? null,
      coldestDay: coldest?.date ?? null,
      meanDailyRange: mean(dailyRanges),
      stddevTempMax: standardDeviation(tempMax),
      totalPrecipitation: records.reduce((sum, r) => sum + (r.precipitation ?? 0), 0),
      avgPrecipitation: mean(precipitation),
      rainyDays,
      dryDays: records.length - rainyDays,
      trendSlopeTempMax: trendSlope(records.map((r) => r.tempMax)),
      trendSlopeTempMin: trendSlope(records.map((r) => r.tempMin))
    });
  }
}