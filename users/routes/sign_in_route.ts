import {
  COOKIE_USER_NAME,
  httpErrors,
  RouterContext,
  superstruct,
} from "../deps.ts";
import { users } from "../models/users.ts";
import { SignInSignUpRequest } from "./name_request.ts";

/** Signs in a user */
const signInRoute = async (context: RouterContext<"/api/users/sign_in">) => {
  const result = context.request.body();
  const data = await result.value;
  superstruct.assert(data, SignInSignUpRequest);

  const { name } = data;

  const existingUser = await users.findOne({ name });
  if (!existingUser) {
    throw new httpErrors.BadRequest("There is no user with that name");
  }

  context.cookies.set(COOKIE_USER_NAME, name);

  context.response.status = 200;
};

export { signInRoute };
