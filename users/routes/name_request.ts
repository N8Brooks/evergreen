import { superstruct } from "../deps.ts";

const { pattern, string } = superstruct;

export const USER_NAME_PATTERN = /^\w{1,32}$/;

export const SignInSignUpRequest = superstruct.object({
  name: pattern(string(), USER_NAME_PATTERN),
});
