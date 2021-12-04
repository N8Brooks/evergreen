import { Application, errorHandler, log, Router } from "./deps.ts";
import { topicCreatedSubscriber } from "./events/topic_created_subscriber.ts";
import { commentCreatedSubscriber } from "./events/comment_created_subscriber.ts";
import { createSubmissionInTopic } from "./routes/topics/create_submission_in_topic.ts";
import { listSubmissionInTopic } from "./routes/topics/list_submissions_in_topic.ts";
import { submissionsHandler } from "./routes/submissions_handler.ts";
import { submissionsByUser } from "./routes/submissions_by_user.ts";

commentCreatedSubscriber.listen();
topicCreatedSubscriber.listen();

const submissionsRouter = new Router()
  .post("/api/topics/:_topicName/submissions", createSubmissionInTopic)
  .get("/api/topics/:_topicName/submissions", listSubmissionInTopic)
  .use("/api/users", submissionsByUser.routes())
  .use("/api/submissions", submissionsHandler.routes());

const app = new Application()
  .use(errorHandler)
  .use(submissionsRouter.routes());

log.info("Listening on 8000");

await app.listen({ port: 8000 });
