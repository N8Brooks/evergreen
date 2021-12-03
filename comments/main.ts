import { Application, errorHandler, log, Router } from "./deps.ts";
import { submissionCreatedSubscriber } from "./events/submission_created_subscriber.ts";
import { commentsForComment } from "./routes/comments_for_comment.ts";
import { commentsForSubmission } from "./routes/comments_for_submission.ts";

submissionCreatedSubscriber.listen();

const commentsRouter = new Router()
  .use("/comments/:commentId/comments", commentsForComment.routes())
  .use("/submissions/:submissionId/comments", commentsForSubmission.routes());

const apiRouter = new Router()
  .use("/api", commentsRouter.routes());

const app = new Application()
  .use(errorHandler)
  .use(apiRouter.routes());

log.info("Listening on 8000");

await app.listen({ port: 8000 });
