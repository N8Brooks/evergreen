// deno-lint-ignore-file no-explicit-any

import { Context, HttpError, log, StructError } from "../deps.ts";

export const errorHandler = async (
  context: Context<Record<string, any>, Record<string, any>>,
  next: () => Promise<unknown>,
) => {
  try {
    await next();
  } catch (err) {
    if (err instanceof StructError) {
      log.warning(err);
      context.response.status = 400;
      const property = err.key ?? "body";
      context.response.body = { message: `Invalid: ${property}` };
    } else if (err instanceof HttpError) {
      log.warning(err);
      context.response.status = err.status;
      context.response.body = { message: err.message };
    } else {
      throw err;
    }
  }
};
