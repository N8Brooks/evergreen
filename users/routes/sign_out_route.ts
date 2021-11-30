import { COOKIE_USER_ID, RouterContext } from "../deps.ts";

/** Signs out a user */
const signOutRoute = (context: RouterContext<"/api/users/sign_out">) => {
  context.cookies.delete(COOKIE_USER_ID);

  context.response.status = 200;
};

export { signOutRoute };
