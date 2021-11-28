import { assert } from "../../../test_deps.ts";
import { RelativeTimeElement } from "./relative_time_element.ts";
import "./relative_time_units.ts"; // Imported for side effects

Deno.test("`RelativeTimeElement.relativeTimeElements` is sorted with no duplicates", () => {
  const { relativeTimeElements } = RelativeTimeElement;
  let previousTimeUnit = relativeTimeElements[0];
  for (let i = 1; i < relativeTimeElements.length; i++) {
    const currentTimeUnit = relativeTimeElements[i];
    assert(previousTimeUnit.factor < currentTimeUnit.factor);
    previousTimeUnit = currentTimeUnit;
  }
});
