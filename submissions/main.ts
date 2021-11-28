import { createSubmissionRouter } from "./routes/topics/create.ts";
import { voteSubmissionRouter } from "./routes/topics/vote.ts";
import { Application, log } from "./deps.ts";
import { topicCreatedSubscriber } from "./events/topic_created_subscriber.ts";
import { listSubmissionsRouter } from "./routes/list.ts";
import { listSubmissionsByTopicRouter } from "./routes/topics/list.ts";
import { listSubmissionsByUserRouter } from "./routes/users/list.ts";
import { listSubmissionsByDownVotedRouter } from "./routes/users/down_voted.ts";
import { listSubmissionsByUpVotedRouter } from "./routes/users/up_voted.ts";
import { commentCreatedSubscriber } from "./events/comment_created_subscriber.ts";

commentCreatedSubscriber.listen();
topicCreatedSubscriber.listen();

const app = new Application();

app.use(createSubmissionRouter.routes());
app.use(voteSubmissionRouter.routes());
app.use(listSubmissionsRouter.routes());
app.use(listSubmissionsByUpVotedRouter.routes());
app.use(listSubmissionsByDownVotedRouter.routes());
app.use(listSubmissionsByTopicRouter.routes());
app.use(listSubmissionsByUserRouter.routes());

log.info("Listening on 8000");

await app.listen({ port: 8000 });
