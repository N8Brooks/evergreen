import { Application, errorHandler, log, Router } from "./deps.ts";
import { submissionCreatedSubscriber } from "./events/submission_created_subscriber.ts";
import { commentsForCommentRouter } from "./routes/comments_for_comment_router.ts";
import { createCommentForSubmission } from "./routes/submissions/create_comment_for_submission.ts";
import { listCommentsForSubmission } from "./routes/submissions/list_comments_for_submission.ts";

submissionCreatedSubscriber.listen();

const commentRouter = new Router()
  .use("/api/comments/:commentId/comments", commentsForCommentRouter.routes())
  .post("/api/submissions/:submissionId/comments", createCommentForSubmission)
  .get("/api/submissions/:submissionId/comments", listCommentsForSubmission);

const app = new Application()
  .use(errorHandler)
  .use(commentRouter.routes());

log.info("Listening on 8000");

await app.listen({ port: 8000 });
