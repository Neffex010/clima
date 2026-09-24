import { API_CONFIG } from '../config/api.config.js';
import { ClimateSummary } from '../domain/ClimateSummary.js';
import { addDays, dateToISO } from '../utils/date.js';

export class ClimateService {
  constructor(archiveRepository) {
    this.repository = archiveRepository;
  }

  async getSummary(location, days = API_CONFIG.archive.defaultRangeDays) {
    const rangeDays = Math.min(Math.floor(days), API_CONFIG.archive.maxRangeDays);
    const end = new Date();
    const start = addDays(end, -(rangeDays - 1));

    const records = await this.repository.fetch(location, {
      startDate: dateToISO(start),
      endDate: dateToISO(end)
    });

    return {
      records,
      summary: ClimateSummary.compute(records)
    };
  }
}