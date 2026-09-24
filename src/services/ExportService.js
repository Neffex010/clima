export class ExportService {
  escapeCsv(value) {
    const s = String(value ?? '');
    return /[",;\n]/.test(s) ? `"${s.replaceAll('"', '""')}"` : s;
  }

  toCSV(headers, rows) {
    const lines = [headers.join(',')];
    rows.forEach((row) => lines.push(row.map((v) => this.escapeCsv(v)).join(',')));
    return lines.join('\n');
  }

  toJSON(data) {
    return JSON.stringify(data, null, 2);
  }

  download(filename, content, mime = 'text/plain') {
    const blob = new Blob([content], { type: `${mime};charset=utf-8` });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  }

  exportForecast(bundle, location) {
    if (!bundle) return;

    const summary = [
      ['Parámetro', 'Valor'],
      ['Ubicación', location?.label ?? ''],
      ['Zona horaria', bundle.timezone],
      ['Fecha de consulta', new Date().toISOString().slice(0, 10)]
    ];

    const headers = [
      'Fecha',
      'Código WMO',
      'Temp máxima (°C)',
      'Temp mínima (°C)',
      'Precipitación (mm)',
      'Prob. precipitación (%)',
      'Viento máx (km/h)'
    ];
    const rows = bundle.daily.map((day) => [
      day.date,
      day.weatherCode,
      day.tempMax,
      day.tempMin,
      day.precipitation,
      day.precipitationProbability,
      day.windSpeedMax
    ]);

    const content = [this.toCSV(...summary), '', this.toCSV(headers, rows)].join('\n');
    this.download(`pronostico-${location?.slug ?? 'clima'}.csv`, content, 'text/csv');
  }

  exportClimate(climate, location) {
    if (!climate) return;

    const summary = [
      ['Parámetro', 'Valor'],
      ['Ubicación', location?.label ?? ''],
      ['Días', climate.summary?.rangeDays ?? climate.records.length],
      ['Temp media máxima (°C)', climate.summary?.avgTempMax ?? ''],
      ['Temp media mínima (°C)', climate.summary?.avgTempMin ?? ''],
      ['Precipitación total (mm)', climate.summary?.totalPrecipitation ?? '']
    ];

    const headers = ['Fecha', 'Código WMO', 'Temp máxima (°C)', 'Temp mínima (°C)', 'Precipitación (mm)'];
    const rows = climate.records.map((record) => [
      record.date,
      record.weatherCode,
      record.tempMax,
      record.tempMin,
      record.precipitation
    ]);

    const content = [this.toCSV(...summary), '', this.toCSV(headers, rows)].join('\n');
    this.download(`clima-historico-${location?.slug ?? 'clima'}.csv`, content, 'text/csv');
  }
}