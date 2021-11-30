import { NAME_PATTERN, superstruct } from "../deps.ts";

const { pattern, string } = superstruct;

export const SignInSignUpRequest = superstruct.object({
  name: pattern(string(), NAME_PATTERN),
});
