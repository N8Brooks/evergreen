/// <reference lib="dom" />

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
  /** Collection of all constructed `RelativeTimeElement`s sorted by granularity */
  static readonly relativeTimeElements: RelativeTimeElement[] = [];

  /** ISO 8601 formatting according to w3 spec */
  abstract durationFormatter(duration: number): string;

  /** One of the `TimeUnits` such as `"seconds"` */
  abstract unit: RelativeTimeUnit;

  /** The conversion factor for this unit to milliseconds */
  abstract factor: number;

  constructor() {
    // Insert `this` into `relativeTimeElements` sorted by `factor`
    const index = RelativeTimeElement
      .relativeTimeElements
      .findIndex(({ factor }) => factor > this.factor);
    if (index < 0) {
      RelativeTimeElement.relativeTimeElements.push(this);
    } else {
      RelativeTimeElement.relativeTimeElements.splice(index, 0, this);
    }
  }

  /** Static time element factory given `createdAt` time. Not meant to be used directly. */
  static _format(createdAt: string): HTMLTimeElement {
    const elapsedTime = Math.max(0, Date.now() - Date.parse(createdAt));

    // Finds the largest time unit that is smaller than
    // `elapsedTime` and no less than the smallest time unit.
    // Essentially an O(n) rightmost binary search for 'is smaller than'.
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
