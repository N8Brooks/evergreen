import { listSubmissionsRouter } from "./routes/topics/list.ts";
import { createSubmissionRouter } from "./routes/topics/create.ts";
import { voteSubmissionRouter } from "./routes/topics/vote.ts";
import { Application } from "./deps.ts";
import { topicCreatedSubscriber } from "./events/topic_created_subscriber.ts";
import { frontPageRouter } from "./routes/front_page.ts";

topicCreatedSubscriber.listen();

const app = new Application();

app.use(listSubmissionsRouter.routes());
app.use(createSubmissionRouter.routes());
app.use(voteSubmissionRouter.routes());
app.use(frontPageRouter.routes());

console.log("Listening on 8000");

await app.listen({ port: 8000 });
