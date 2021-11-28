import { assertStrictEquals } from "../../../test_deps.ts";
import { RTF } from "./relative_time_element.ts";
import { relativeTimeFormat } from "./relative_time_format.ts";
import {
  DAY_UNIT_FACTOR_MS,
  MONTH_UNIT_FACTOR_DAYS,
  YEAR_UNIT_FACTOR_DAYS,
} from "./relative_time_units.ts";

// TODO: mock time

Deno.test("rendered time element is no less than seconds", () => {
  const createdAt = Date.now() + DAY_UNIT_FACTOR_MS;
  const time = relativeTimeFormat(createdAt);
  assertStrictEquals(time.tagName, "TIME");
  assertStrictEquals(time.innerText, RTF.format(-0, "seconds"));
  assertStrictEquals(time.dateTime, "PT0S");
});

Deno.test("rendered time element T5M ago", () => {
  const createdAt = Date.now() - 5 * 60 * 1000;
  const time = relativeTimeFormat(createdAt);
  assertStrictEquals(time.tagName, "TIME");
  assertStrictEquals(time.innerText, RTF.format(-5, "minutes"));
  assertStrictEquals(time.dateTime, "PT5M");
});

Deno.test("rendered time element T12H ago", () => {
  const createdAt = Date.now() - 12 * 60 * 60 * 1000;
  const time = relativeTimeFormat(createdAt);
  assertStrictEquals(time.tagName, "TIME");
  assertStrictEquals(time.innerText, RTF.format(-12, "hours"));
  assertStrictEquals(time.dateTime, "PT12H");
});

Deno.test("rendered time element 3D ago", () => {
  const createdAt = Date.now() - 3 * DAY_UNIT_FACTOR_MS;
  const time = relativeTimeFormat(createdAt);
  assertStrictEquals(time.tagName, "TIME");
  assertStrictEquals(time.innerText, RTF.format(-3, "days"));
  assertStrictEquals(time.dateTime, "P3D");
});

Deno.test("rendered time element 6M ago", () => {
  const sixMonthsInDays = 6 * MONTH_UNIT_FACTOR_DAYS;
  const createdAt = Date.now() - sixMonthsInDays * DAY_UNIT_FACTOR_MS;
  const time = relativeTimeFormat(createdAt);
  assertStrictEquals(time.tagName, "TIME");
  assertStrictEquals(time.innerText, RTF.format(-6, "months"));
  assertStrictEquals(time.dateTime, `P${sixMonthsInDays}D`);
});

Deno.test("rendered time element 4Y ago", () => {
  const fourYearsInDays = 4 * YEAR_UNIT_FACTOR_DAYS;
  const createdAt = Date.now() - fourYearsInDays * DAY_UNIT_FACTOR_MS;
  const time = relativeTimeFormat(createdAt);
  assertStrictEquals(time.tagName, "TIME");
  assertStrictEquals(time.innerText, RTF.format(-4, "years"));
  assertStrictEquals(time.dateTime, `P${fourYearsInDays}D`);
});
