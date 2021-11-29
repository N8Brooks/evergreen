import { RouterContext } from "../deps.ts";

/** Signs out a user */
const signOutRoute = (context: RouterContext<"/api/users/sign_out">) => {
  context.cookies.delete("user-name");

  context.response.status = 200;
};

export { signOutRoute };
