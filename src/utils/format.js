const DIRECTION_LABELS = [
  'N',
  'NNE',
  'NE',
  'ENE',
  'E',
  'ESE',
  'SE',
  'SSE',
  'S',
  'SSO',
  'SO',
  'OSO',
  'O',
  'ONO',
  'NO',
  'NNO'
];

export function formatTemperature(value) {
  return value == null ? '--' : `${Math.round(value)}\u00B0C`;
}

export function formatDegrees(value) {
  return value == null ? '--' : `${Math.round(value)}\u00B0`;
}

export function formatPercent(value) {
  return value == null ? '--' : `${Math.round(value)}%`;
}

export function formatPrecipitation(value) {
  return value == null ? '--' : `${value.toFixed(1)} mm`;
}

export function formatWind(value) {
  return value == null ? '--' : `${Math.round(value)} km/h`;
}

export function formatPressure(value) {
  return value == null ? '--' : `${Math.round(value)} hPa`;
}

export function formatNumber(value, digits = 0) {
  return value == null ? '--' : value.toFixed(digits);
}

export function formatSigned(value, suffix = '') {
  if (value == null) return '--';
  const sign = value > 0 ? '+' : '';
  return `${sign}${value.toFixed(2)}${suffix}`;
}

export function formatDirection(degrees) {
  if (degrees == null) return '--';
  const index = Math.round(degrees / 22.5) % 16;
  return DIRECTION_LABELS[index];
}

export function capitalize(value) {
  return value ? value.charAt(0).toUpperCase() + value.slice(1) : '';
}