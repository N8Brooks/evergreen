import { Application, errorHandler, log, Router } from "./deps.ts";
import { topicCreatedSubscriber } from "./events/topic_created_subscriber.ts";
import { listSubmissionsByUserRouter } from "./routes/users/list.ts";
import { commentCreatedSubscriber } from "./events/comment_created_subscriber.ts";
import { listSubmissionInTopicRoute } from "./routes/topics/list_submissions_in_topic_route.ts";
import { createSubmissionInTopicRoute } from "./routes/topics/create_submission_in_topic_route.ts";
import { voteOnSubmissionRoute } from "./routes/vote_on_submission_route.ts";
import { listSubmissionsRoute } from "./routes/list_submissions_route.ts";
import { listUserDownVotedSubmissions } from "./routes/users/listUserDownVotedSubmissions.ts";
import { listUserUpVotedSubmissions } from "./routes/users/listUserUpVotedSubmissions.ts";

commentCreatedSubscriber.listen();
topicCreatedSubscriber.listen();

const submissionsRouter = new Router()
  .post("/api/topics/:topicName/submissions", createSubmissionInTopicRoute)
  .get("/api/topics/:topicName/submissions", listSubmissionInTopicRoute)
  .patch("/api/submissions/:submissionId", voteOnSubmissionRoute)
  .get("/api/submissions", listSubmissionsRoute)
  .get("/api/users/:_userName/down_voted", listUserDownVotedSubmissions)
  .get("/api/users/:_userName/up_voted", listUserUpVotedSubmissions);

const app = new Application()
  .use(errorHandler)
  .use(submissionsRouter.routes());

app.use(listSubmissionsByUserRouter.routes());

log.info("Listening on 8000");

await app.listen({ port: 8000 });
