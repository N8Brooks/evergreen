import { listSubmissionsRouter } from "./routes/list.ts";
import { createSubmissionRouter } from "./routes/create.ts";
import { voteSubmissionRouter } from "./routes/vote.ts";
import { Application } from "./deps.ts";
import { topicCreatedSubscriber } from "./events/topic_created_subscriber.ts";

topicCreatedSubscriber.listen();

const app = new Application();

app.use(listSubmissionsRouter.routes());
app.use(createSubmissionRouter.routes());
app.use(voteSubmissionRouter.routes());

console.log("Listening on 8000");

await app.listen({ port: 8000 });
