import { KeyStack } from "https://deno.land/x/oak@v10.0.0/keyStack.ts";
import { Application, HttpError, log, Status, superstruct } from "./deps.ts";
import { commentVotedSubscriber } from "./events/comment_voted_subscriber.ts";
import { submissionVotedSubscriber } from "./events/submission_voted_subscriber.ts";
import { signUpRouter } from "./routes/sign_up_router.ts";

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

app.use(signUpRouter.routes());

log.info("Listening on 8000!");

await app.listen({ port: 8000 });
