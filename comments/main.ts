import { Application, errorHandler, log, Router } from "./deps.ts";
import { submissionCreatedSubscriber } from "./events/submission_created_subscriber.ts";
import { commentsForComment } from "./routes/comments_for_comment.ts";
import { commentsForSubmission } from "./routes/comments_for_submission.ts";

submissionCreatedSubscriber.listen();

const routes = new Router()
  .use(
    "/api/comments/:commentId/comments",
    commentsForComment.routes(),
  )
  .use(
    "/api/submissions/:submissionId/comments",
    commentsForSubmission.routes(),
  )
  .routes();

const app = new Application()
  .use(errorHandler)
  .use(routes);

log.info("Listening on 8000");

await app.listen({ port: 8000 });
