import { Application, errorHandler, log, Router } from "./deps.ts";
import { submissionCreatedSubscriber } from "./events/submission_created_subscriber.ts";
import { createCommentForComment } from "./routes/comments/create_comment_for_comment.ts";
import { listCommentCommentsRouter } from "./routes/comments/list.ts";
import { voteCommentRouter } from "./routes/comments/vote.ts";
import { createSubmissionCommentRouter } from "./routes/submissions/create.ts";
import { listSubmissionCommentsRouter } from "./routes/submissions/list.ts";

submissionCreatedSubscriber.listen();

const commentRouter = new Router()
  .post("/api/comments/:commentId/comments", createCommentForComment);

const app = new Application()
  .use(errorHandler)
  .use(commentRouter.routes());

app.use(listCommentCommentsRouter.routes());
app.use(voteCommentRouter.routes());
app.use(createSubmissionCommentRouter.routes());
app.use(listSubmissionCommentsRouter.routes());

log.info("Listening on 8000");

await app.listen({ port: 8000 });
