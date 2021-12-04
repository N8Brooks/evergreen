import { Application, errorHandler, log, Router } from "./deps.ts";
import { topicCreatedSubscriber } from "./events/topic_created_subscriber.ts";
import { commentCreatedSubscriber } from "./events/comment_created_subscriber.ts";
import { listSubmissionsByUser } from "./routes/users/list_submissions_by_user.ts";
import { createSubmissionInTopic } from "./routes/topics/create_submission_in_topic.ts";
import { listSubmissionInTopic } from "./routes/topics/list_submissions_in_topic.ts";
import { listUserDownVotedSubmissions } from "./routes/users/list_user_down_voted_submissions.ts";
import { listUserUpVotedSubmissions } from "./routes/users/list_user_up_voted_submissions.ts";
import { submissionsHandler } from "./routes/submissions_handler.ts";

commentCreatedSubscriber.listen();
topicCreatedSubscriber.listen();

const submissionsRouter = new Router()
  .post("/api/topics/:_topicName/submissions", createSubmissionInTopic)
  .get("/api/topics/:_topicName/submissions", listSubmissionInTopic)
  .get("/api/users/:_userName/down_voted", listUserDownVotedSubmissions)
  .get("/api/users/:_userName/up_voted", listUserUpVotedSubmissions)
  .get("/api/users/:_userName/submissions", listSubmissionsByUser)
  .use("/api/submissions", submissionsHandler.routes());

const app = new Application()
  .use(errorHandler)
  .use(submissionsRouter.routes());

log.info("Listening on 8000");

await app.listen({ port: 8000 });
