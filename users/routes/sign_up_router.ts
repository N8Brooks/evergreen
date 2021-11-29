import { httpErrors, log, Router, superstruct } from "../deps.ts";
import { userCreatedPublisher } from "../events/user_created_publisher.ts";
import { users } from "../models/users.ts";

const { pattern, string } = superstruct;

const USER_NAME_PATTERN = /^\w{1,32}$/;

const SignUpRequest = superstruct.object({
  name: pattern(string(), USER_NAME_PATTERN),
});

const signUpRouter = new Router();

signUpRouter.post("/api/users/sign_up", async (context) => {
  const result = context.request.body();
  const data = await result.value;
  superstruct.assert(data, SignUpRequest);

  const { name } = data;

  const existingUser = await users.findOne({ name });
  if (existingUser) {
    throw new httpErrors.BadRequest("A user already exists with that name");
  }

  const createdAt = Date.now();
  await users.insertOne({
    createdAt,
    name,
    commentScore: 0,
    submissionScore: 0,
  });

  log.debug(`User ${name} created`);
  userCreatedPublisher.publish({
    createdAt,
    name,
  });

  context.cookies.set("user-name", name);

  context.response.status = 201;
});

export { signUpRouter };
