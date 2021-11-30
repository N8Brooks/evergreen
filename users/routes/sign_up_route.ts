import {
  COOKIE_USER_ID,
  httpErrors,
  log,
  RouterContext,
  superstruct,
} from "../deps.ts";
import { userCreatedPublisher } from "../events/user_created_publisher.ts";
import { users } from "../models/users.ts";
import { SignInSignUpRequest } from "./name_request.ts";

/** Signs up a user */
const signUpRoute = async (context: RouterContext<"/api/users/sign_up">) => {
  const result = context.request.body();
  const data = await result.value;
  superstruct.assert(data, SignInSignUpRequest);

  const { name } = data;
  const id = name.toLowerCase();

  const existingUser = await users.findOne({ _id: id });
  if (existingUser) {
    throw new httpErrors.BadRequest("A user already exists with that name");
  }

  const createdAt = Date.now();
  await users.insertOne({
    _id: id,
    createdAt,
    name,
    commentScore: 0,
    submissionScore: 0,
  });

  log.debug(`User ${name} created`);
  userCreatedPublisher.publish({
    id,
    createdAt,
    name,
  });

  context.cookies.set(COOKIE_USER_ID, id);

  context.response.status = 201;
};

export { signUpRoute };
