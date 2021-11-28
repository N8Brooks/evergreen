import "./relative_time_units.ts"; // Imported for side effects
import { RelativeTimeElement } from "./relative_time_element.ts";

/**
 * `RelativeTimeElement` factory given `createdAt` time. Delegate for
 * `RelativeTimeElement._format` that ***is*** meant to be used directly.
 */
export const relativeTimeFormat = RelativeTimeElement._format;
