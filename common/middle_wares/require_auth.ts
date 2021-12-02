// deno-lint-ignore-file no-explicit-any

import { COOKIE_USER_NAME } from "../constants.ts";
import { Context, httpErrors } from "../deps.ts";

export interface RequireAuthState {
  userId: string;
  userName: string;
}

export const requireAuth = async (
  context: Context<Record<string, any>, Record<string, any>>,
  next: () => Promise<unknown>,
) => {
  const userName = await context.cookies.get(COOKIE_USER_NAME);
  if (!userName) {
    throw new httpErrors.Unauthorized("Sign in first");
  }
  context.state.userName = userName;
  context.state.userId = userName.toLowerCase();
  await next();
};
