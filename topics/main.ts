import { Application, log } from "./deps.ts";
import { commentVotedSubscriber } from "./events/comment_voted_subscriber.ts";
import { submissionVotedSubscriber } from "./events/submission_voted_subscriber.ts";
import { createTopicRouter } from "./routes/create.ts";
import { listTopicsRouter } from "./routes/list.ts";

commentVotedSubscriber.listen();
submissionVotedSubscriber.listen();

const app = new Application();

app.use(createTopicRouter.routes());
app.use(listTopicsRouter.routes());

log.info("Listening on 8000!");

await app.listen({ port: 8000 });
