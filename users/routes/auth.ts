import {
  COOKIE_USER_NAME,
  httpErrors,
  log,
  NAME_PATTERN,
  Router,
  superstruct,
} from "../deps.ts";
import { userCreatedPublisher } from "../events/user_created_publisher.ts";
import { users, UserSchema } from "../models/users.ts";

const { pattern, string } = superstruct;

const SignInSignUpData = superstruct.object({
  name: pattern(string(), NAME_PATTERN),
});

interface SignInSignUpState {
  /** Possibly incorrect user name */
  _userName: string;

  /** Possibly un-authorized user id */
  userId: string;

  /** Possibly undefined user */
  user?: UserSchema;
}

const router = new Router<SignInSignUpState>()
  .post("/sign_out", (context) => {
    // Delete their cookie
    context.cookies.delete(COOKIE_USER_NAME);
  })
  .use(async (context, next) => {
    // Validate request or throw 400
    const result = context.request.body();
    const data = await result.value;
    superstruct.assert(data, SignInSignUpData);

    // Find possibly existing user
    context.state._userName = data.name;
    const id = data.name.toLowerCase();
    context.state.user = await users.findOne({ _id: id });
    await next();
  })
  .post("/sign_in", (context) => {
    // Check if valid or throw 401
    const { user, _userName } = context.state;
    if (!user || user.name !== _userName) {
      throw new httpErrors.Unauthorized("Invalid credentials");
    }

    // Authenticate
    context.cookies.set(COOKIE_USER_NAME, user.name);

    // Respond
    const id = context.state.userId;
    context.response.body = { id };
  })
  .post("/sign_up", async (context) => {
    // Throw 400 if user exists
    const { user } = context.state;
    if (user) {
      throw new httpErrors.BadRequest("A user already exists with that name");
    }

    // Create automatically authorized user
    const { userId: id, _userName: name } = context.state;
    const createdAt = Date.now();
    await users.insertOne({
      _id: id,
      createdAt,
      name,
      commentScore: 0,
      submissionScore: 0,
    });

    // Debug
    log.debug(`User ${name} created`);

    // Publish user created event
    userCreatedPublisher.publish({
      id,
      createdAt,
      name,
    });

    // Authenticate
    context.cookies.set(COOKIE_USER_NAME, name);

    // Respond
    context.response.body = { id };
    context.response.status = 201;
  });

export { router as auth };
