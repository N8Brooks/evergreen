import { RelativeTimeElement } from "./relative_time_element.ts";

// This file contains a collection of singletons representing time units.

/** One day in milliseconds helper */
export const DAY_UNIT_FACTOR_MS = 24 * 60 * 60 * 1000;

/** Approximate month in days */
export const MONTH_UNIT_FACTOR_DAYS = 31;

/** Approximate year in days */
export const YEAR_UNIT_FACTOR_DAYS = 365;

class SecondsUnit extends RelativeTimeElement {
  readonly unit = "seconds";
  readonly factor = 1000;

  durationFormatter(duration: number): string {
    return `PT${duration}S`;
  }
}

export const secondsUnit = new SecondsUnit();

class MinutesUnit extends RelativeTimeElement {
  readonly unit = "minutes";
  readonly factor = 60 * 1000;

  durationFormatter(duration: number): string {
    return `PT${duration}M`;
  }
}

export const minutesUnit = new MinutesUnit();

class HoursUnit extends RelativeTimeElement {
  readonly unit = "hours";
  readonly factor = 60 * 60 * 1000;

  durationFormatter(duration: number): string {
    return `PT${duration}H`;
  }
}

export const hoursUnit = new HoursUnit();

class DaysUnit extends RelativeTimeElement {
  readonly unit = "days";
  readonly factor = DAY_UNIT_FACTOR_MS;

  durationFormatter(duration: number): string {
    return `P${duration}D`;
  }
}

export const daysUnit = new DaysUnit();

class MonthsUnit extends RelativeTimeElement {
  readonly unit = "months";
  readonly factor = MONTH_UNIT_FACTOR_DAYS * DAY_UNIT_FACTOR_MS;

  durationFormatter(duration: number): string {
    return `P${MONTH_UNIT_FACTOR_DAYS * duration}D`;
  }
}

export const monthsUnit = new MonthsUnit();

class YearsUnit extends RelativeTimeElement {
  readonly unit = "years";
  readonly factor = YEAR_UNIT_FACTOR_DAYS * DAY_UNIT_FACTOR_MS;

  durationFormatter(duration: number): string {
    return `P${YEAR_UNIT_FACTOR_DAYS * duration}D`;
  }
}

export const yearsUnit = new YearsUnit();
