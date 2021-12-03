import { Application, errorHandler, log, Router } from "./deps.ts";
import { commentVotedSubscriber } from "./events/comment_voted_subscriber.ts";
import { submissionVotedSubscriber } from "./events/submission_voted_subscriber.ts";
import { auth } from "./routes/auth.ts";

commentVotedSubscriber.listen();
submissionVotedSubscriber.listen();

const usersRouter = new Router()
  .use("/api/users", auth.routes());

const app = new Application()
  .use(errorHandler)
  .use(usersRouter.routes());

log.info("Listening on 8000!");

await app.listen({ port: 8000 });
