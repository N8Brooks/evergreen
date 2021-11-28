import { assertStrictEquals } from "../../../deps.ts";
import {
  daysUnit,
  hoursUnit,
  minutesUnit,
  MONTH_UNIT_FACTOR_DAYS,
  monthsUnit,
  secondsUnit,
  YEAR_UNIT_FACTOR_DAYS,
  yearsUnit,
} from "./relative_time_units.ts";

Deno.test("`secondsUnit` `durationFormatter`", () => {
  const duration = 10;
  const expected = `PT${duration}S`;
  const actual = secondsUnit.durationFormatter(duration);
  assertStrictEquals(actual, expected);
});

Deno.test("`minutesUnit` `durationFormatter`", () => {
  const duration = 10;
  const expected = `PT${duration}M`;
  const actual = minutesUnit.durationFormatter(duration);
  assertStrictEquals(actual, expected);
});

Deno.test("`hoursUnit` `durationFormatter`", () => {
  const duration = 10;
  const expected = `PT${duration}H`;
  const actual = hoursUnit.durationFormatter(duration);
  assertStrictEquals(actual, expected);
});

Deno.test("`daysUnit` `durationFormatter`", () => {
  const duration = 10;
  const expected = `P${duration}D`;
  const actual = daysUnit.durationFormatter(duration);
  assertStrictEquals(actual, expected);
});

Deno.test("`monthsUnit` `durationFormatter`", () => {
  const duration = 10;
  const expected = `P${MONTH_UNIT_FACTOR_DAYS * duration}D`;
  const actual = monthsUnit.durationFormatter(duration);
  assertStrictEquals(actual, expected);
});

Deno.test("`yearsUnit` `durationFormatter`", () => {
  const duration = 10;
  const expected = `P${YEAR_UNIT_FACTOR_DAYS * duration}D`;
  const actual = yearsUnit.durationFormatter(duration);
  assertStrictEquals(actual, expected);
});
