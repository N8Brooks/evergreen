import { createSubmissionRouter } from "./routes/topics/create.ts";
import { voteSubmissionRouter } from "./routes/topics/vote.ts";
import { Application } from "./deps.ts";
import { topicCreatedSubscriber } from "./events/topic_created_subscriber.ts";
import { listSubmissionsRouter } from "./routes/list.ts";
import { listSubmissionsByTopicRouter } from "./routes/topics/list.ts";
import { listSubmissionsByUserRouter } from "./routes/users/list.ts";

topicCreatedSubscriber.listen();

const app = new Application();

app.use(createSubmissionRouter.routes());
app.use(voteSubmissionRouter.routes());
app.use(listSubmissionsRouter.routes());
app.use(listSubmissionsByTopicRouter.routes());
app.use(listSubmissionsByUserRouter.routes());

console.log("Listening on 8000");

await app.listen({ port: 8000 });
