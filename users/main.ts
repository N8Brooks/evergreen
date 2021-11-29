import { Application, HttpError, log, Router, superstruct } from "./deps.ts";
import { commentVotedSubscriber } from "./events/comment_voted_subscriber.ts";
import { submissionVotedSubscriber } from "./events/submission_voted_subscriber.ts";
import { signInRoute } from "./routes/sign_in_route.ts";
import { signOutRoute } from "./routes/sign_out_route.ts";
import { signUpRoute } from "./routes/sign_up_route.ts";

const { StructError } = superstruct;

commentVotedSubscriber.listen();
submissionVotedSubscriber.listen();

const app = new Application();

app.use(async (context, next) => {
  try {
    await next();
  } catch (err) {
    if (err instanceof StructError) {
      log.warning(err);
      context.response.status = 400;
      context.response.body = { message: `Invalid: ${err.key}` };
    } else if (err instanceof HttpError) {
      log.warning(err);
      context.response.status = err.status;
      context.response.body = { message: err.message };
    } else {
      throw err;
    }
  }
});

const usersRouter = new Router()
  .post("/api/users/sign_up", signUpRoute)
  .post("/api/users/sign_in", signInRoute)
  .post("/api/users/sign_out", signOutRoute);

app.use(usersRouter.routes());

log.info("Listening on 8000!");

await app.listen({ port: 8000 });
