export function mean(values) {
  if (!values.length) return null;
  return values.reduce((sum, v) => sum + v, 0) / values.length;
}

export function median(values) {
  if (!values.length) return null;
  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
}

export function minValue(values) {
  return values.length ? Math.min(...values) : null;
}

export function maxValue(values) {
  return values.length ? Math.max(...values) : null;
}

export function standardDeviation(values) {
  if (values.length < 2) return null;
  const m = mean(values);
  const variance = values.reduce((sum, v) => sum + (v - m) ** 2, 0) / (values.length - 1);
  return Math.sqrt(variance);
}

export function percentile(values, p) {
  if (!values.length) return null;
  const sorted = [...values].sort((a, b) => a - b);
  const index = Math.ceil((p / 100) * sorted.length) - 1;
  return sorted[Math.min(index, sorted.length - 1)];
}

export function percentileRank(values, value) {
  if (!values.length) return null;
  const countBelow = values.filter((v) => v < value).length;
  return (countBelow / values.length) * 100;
}

export function trendSlope(values) {
  if (values.length < 2) return null;
  const n = values.length;
  const xMean = (n - 1) / 2;
  const yMean = mean(values);
  let numerator = 0;
  let denominator = 0;
  values.forEach((y, x) => {
    numerator += (x - xMean) * (y - yMean);
    denominator += (x - xMean) ** 2;
  });
  return denominator ? numerator / denominator : null;
}