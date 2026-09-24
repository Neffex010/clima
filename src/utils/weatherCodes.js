function sunIcon(size) {
  return `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"><circle cx="12" cy="12" r="4.2"/><path d="M12 2.5V4M12 20v1.5M2.5 12H4M20 12h1.5M5.2 5.2l1.1 1.1M17.7 17.7l1.1 1.1M5.2 18.8l1.1-1.1M17.7 6.3l1.1-1.1"/></svg>`;
}

function partlyIcon(size) {
  return `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"><circle cx="8.5" cy="7" r="3.4"/><path d="M8.5 1.6v1M8.5 12.4v1M1.6 7h1M12.4 7h1M3.7 2.9l.8.8M11.8 10.9l.8.8M3.7 11.1l.8-.8M11.8 3.1l.8-.8"/><path d="M17.5 16.5h2a3 3 0 0 0 .5-5.94 4.4 4.4 0 0 0-8.2.35A3 3 0 0 1 9 19.5h6.5a3 3 0 0 0 2-3z"/></svg>`;
}

function cloudIcon(size) {
  return `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"><path d="M16.5 18.5H8a3.6 3.6 0 0 1-.72-7.1 4.9 4.9 0 0 1 9.2.18 3.1 3.1 0 0 1 .02 6.92z"/></svg>`;
}

function fogIcon(size) {
  return `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"><path d="M4 8h13M4 12h15M4 16h10"/></svg>`;
}

function drizzleIcon(size) {
  return `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><path d="M16.8 15H7.6a3.2 3.2 0 0 1-.64-6.33 4.6 4.6 0 0 1 8.6.62A2.9 2.9 0 0 1 16.8 15z"/><path d="M9.5 17l-1.5 2M13 17l-1.5 2M16.5 17l-1.5 2" stroke-width="1.8"/></svg>`;
}

function rainIcon(size) {
  return `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><path d="M16.8 15H7.6a3.2 3.2 0 0 1-.64-6.33 4.6 4.6 0 0 1 8.6.62A2.9 2.9 0 0 1 16.8 15z"/><path d="M8 17.5l-.9 2M12 17.5l-.9 2M16 17.5l-.9 2" stroke-width="1.8"/></svg>`;
}

function freezingIcon(size) {
  return `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><path d="M16.8 15H7.6a3.2 3.2 0 0 1-.64-6.33 4.6 4.6 0 0 1 8.6.62A2.9 2.9 0 0 1 16.8 15z"/><path d="M12 21l-1-2 1-2 1 2zM10.5 19.5h3" stroke-width="1.6"/></svg>`;
}

function snowIcon(size) {
  return `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><path d="M16.8 15H7.6a3.2 3.2 0 0 1-.64-6.33 4.6 4.6 0 0 1 8.6.62A2.9 2.9 0 0 1 16.8 15z"/><path d="M8.5 17.5l-1 2M11.5 17.5l-1 2M14.5 17.5l-1 2" stroke-width="1.7"/></svg>`;
}

function thunderIcon(size) {
  return `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><path d="M16.8 14.5H7.6a3.2 3.2 0 0 1-.64-6.33 4.6 4.6 0 0 1 8.6.62A2.9 2.9 0 0 1 16.8 14.5z"/><path d="M12.6 13l-1.8 2.8h1.8l-.7 3.2 2.4-3h-1.7l1-3z" fill="currentColor" stroke="none"/></svg>`;
}

function cloudFallbackIcon(size) {
  return cloudIcon(size);
}

export const WEATHER_ICONS = {
  sun: sunIcon,
  partly: partlyIcon,
  cloud: cloudIcon,
  fog: fogIcon,
  drizzle: drizzleIcon,
  rain: rainIcon,
  freezing: freezingIcon,
  snow: snowIcon,
  thunder: thunderIcon
};

const CODE_TYPES = [
  { key: 'sun', label: 'Despejado', codes: [0] },
  { key: 'partly', label: 'Parcialmente nublado', codes: [1, 2] },
  { key: 'cloud', label: 'Nublado', codes: [3] },
  { key: 'fog', label: 'Niebla', codes: [45, 48] },
  { key: 'drizzle', label: 'Llovizna', codes: [51, 53, 55, 56, 57] },
  { key: 'rain', label: 'Lluvia', codes: [61, 63, 65, 80, 81, 82] },
  { key: 'freezing', label: 'Lluvia helada', codes: [66, 67] },
  { key: 'snow', label: 'Nieve', codes: [71, 73, 75, 77, 85, 86] },
  { key: 'thunder', label: 'Tormentas', codes: [95, 96, 99] }
];

const CODE_LOOKUP = new Map();
CODE_TYPES.forEach(({ key, label, codes }) =>
  codes.forEach((code) => CODE_LOOKUP.set(code, { key, label }))
);

export function weatherInfo(code) {
  return CODE_LOOKUP.get(code) ?? { key: 'cloud', label: 'Sin datos' };
}

export function weatherLabel(code) {
  return weatherInfo(code).label;
}

export function weatherIcon(code, size = 48) {
  const { key } = weatherInfo(code);
  const factory = WEATHER_ICONS[key] ?? cloudFallbackIcon;
  return factory(size);
}