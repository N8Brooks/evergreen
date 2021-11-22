import { Application } from "./deps.ts";
import { natsConnection } from "./events/nats_connection.ts";
import { SubmissionCreatedSubscriber } from "./events/submission_created_subscriber.ts";
import { createCommentCommentRouter } from "./routes/comments/create.ts";
import { listCommentCommentsRouter } from "./routes/comments/list.ts";
import { voteCommentRouter } from "./routes/comments/vote.ts";
import { createSubmissionCommentRouter } from "./routes/submissions/create.ts";
import { listSubmissionCommentsRouter } from "./routes/submissions/list.ts";

new SubmissionCreatedSubscriber(natsConnection).listen();

const app = new Application();

app.use(createCommentCommentRouter.routes());
app.use(listCommentCommentsRouter.routes());
app.use(voteCommentRouter.routes());
app.use(createSubmissionCommentRouter.routes());
app.use(listSubmissionCommentsRouter.routes());

console.log("Listening on 8000");

await app.listen({ port: 8000 });
