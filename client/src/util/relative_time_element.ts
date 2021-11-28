/// <reference lib="dom" />

/** One day in milliseconds helper */
const DAY_UNIT_FACTOR_MS = 24 * 60 * 60 * 1000;

/** Approximate month in days */
const MONTH_UNIT_FACTOR_DAYS = 31;

/** Approximate year in days */
const YEAR_UNIT_FACTOR_DAYS = 365;

/** Possible units of conversion */
type TimeUnits =
  | "seconds"
  | "minutes"
  | "hours"
  | "days"
  | "months"
  | "years";

/** `TimeUnits` intersection with `Intl.RelativeTimeFormatUnit` */
type RelativeTimeUnit = Extract<Intl.RelativeTimeFormatUnit, TimeUnits>;

/** Locality formatter */
const RTF = new Intl.RelativeTimeFormat();

/** Data and functionality associated with a given time unit */
export abstract class RelativeTimeElement {
  private static relativeTimeElements: RelativeTimeElement[] = [];

  protected abstract durationFormatter(duration: number): string;
  protected abstract unit: RelativeTimeUnit;
  protected abstract factor: number;

  constructor() {
    RelativeTimeElement.relativeTimeElements.push(this);
  }

  /** Static time element factory given `createdAt` time */
  static format(createdAt: string): HTMLTimeElement {
    const elapsedTime = Math.max(0, Date.now() - Date.parse(createdAt));

    // Finds the largest time unit that is smaller than
    // `elapsedTime` and no less than the seconds unit.
    // Essentially a linear rightmost binary search for 'is smaller than'.
    let previousTimeUnit = RelativeTimeElement.relativeTimeElements[0];
    for (const currentTimeUnit of RelativeTimeElement.relativeTimeElements) {
      if (currentTimeUnit.factor > elapsedTime) {
        break;
      } else {
        previousTimeUnit = currentTimeUnit;
      }
    }

    return previousTimeUnit.render(elapsedTime);
  }

  /** Renders a time element with localized text and duration format. */
  render(elapsedTime: number): HTMLTimeElement {
    const timeElement = document.createElement("time");
    const convertedTime = Math.round(elapsedTime / this.factor);
    timeElement.innerText = RTF.format(-convertedTime, this.unit);
    timeElement.dateTime = this.durationFormatter(convertedTime);
    return timeElement;
  }
}

new class SecondsUnit extends RelativeTimeElement {
  readonly unit = "seconds";
  factor = 1000;

  durationFormatter(duration: number): string {
    return `PT${duration}S`;
  }
}();

new class MinutesUnit extends RelativeTimeElement {
  readonly unit = "minutes";
  factor = 60 * 1000;

  durationFormatter(duration: number): string {
    return `PT${duration}M`;
  }
}();

new class HoursUnit extends RelativeTimeElement {
  readonly unit = "hours";
  factor = 60 * 60 * 1000;

  durationFormatter(duration: number): string {
    return `PT${duration}H`;
  }
}();

new class DaysUnit extends RelativeTimeElement {
  readonly unit = "days";
  factor = DAY_UNIT_FACTOR_MS;

  durationFormatter(duration: number): string {
    return `P${duration}D`;
  }
}();

new class MonthsUnit extends RelativeTimeElement {
  readonly unit = "months";
  factor = MONTH_UNIT_FACTOR_DAYS * DAY_UNIT_FACTOR_MS;

  durationFormatter(duration: number): string {
    return `P${MONTH_UNIT_FACTOR_DAYS * duration}D`;
  }
}();

new class YearsUnit extends RelativeTimeElement {
  readonly unit = "years";
  factor = YEAR_UNIT_FACTOR_DAYS * DAY_UNIT_FACTOR_MS;

  durationFormatter(duration: number): string {
    return `P${YEAR_UNIT_FACTOR_DAYS * duration}D`;
  }
}();
