import { voteSubmissionRouter } from "./routes/topics/vote.ts";
import { Application, errorHandler, log, Router } from "./deps.ts";
import { topicCreatedSubscriber } from "./events/topic_created_subscriber.ts";
import { listSubmissionsRouter } from "./routes/list.ts";
import { listSubmissionsByUserRouter } from "./routes/users/list.ts";
import { listSubmissionsByDownVotedRouter } from "./routes/users/down_voted.ts";
import { listSubmissionsByUpVotedRouter } from "./routes/users/up_voted.ts";
import { commentCreatedSubscriber } from "./events/comment_created_subscriber.ts";
import { listSubmissionInTopicRoute } from "./routes/topics/list_submissions_in_topic_route.ts";
import { createSubmissionInTopicRoute } from "./routes/topics/create_submission_in_topic_route.ts";

commentCreatedSubscriber.listen();
topicCreatedSubscriber.listen();

const submissionsRouter = new Router()
  .post("/api/topics/:topicName/submissions", createSubmissionInTopicRoute)
  .get("/api/topics/:topicName/submissions", listSubmissionInTopicRoute);

const app = new Application()
  .use(errorHandler)
  .use(submissionsRouter.routes());

app.use(voteSubmissionRouter.routes());
app.use(listSubmissionsRouter.routes());
app.use(listSubmissionsByUpVotedRouter.routes());
app.use(listSubmissionsByDownVotedRouter.routes());
app.use(listSubmissionsByUserRouter.routes());

log.info("Listening on 8000");

await app.listen({ port: 8000 });
