import { Application, log } from "./deps.ts";
import { commentVotedSubscriber } from "./events/comment_voted_subscriber.ts";
import { submissionVotedSubscriber } from "./events/submission_voted_subscriber.ts";
import { createUserRouter } from "./routes/create.ts";
import { listUsersRouter } from "./routes/list.ts";

commentVotedSubscriber.listen();
submissionVotedSubscriber.listen();

const app = new Application();

app.use(createUserRouter.routes());
app.use(listUsersRouter.routes());

log.info("Listening on 8000!");

await app.listen({ port: 8000 });
