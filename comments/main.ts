import { Application } from "./deps.ts";
import { createCommentCommentRouter } from "./routes/comments/create.ts";
import { listCommentCommentsRouter } from "./routes/comments/list.ts";
import { createSubmissionCommentRouter } from "./routes/submissions/create.ts";
import { listSubmissionCommentsRouter } from "./routes/submissions/list.ts";

const app = new Application();

app.use(createCommentCommentRouter.routes());
app.use(listCommentCommentsRouter.routes());
app.use(createSubmissionCommentRouter.routes());
app.use(listSubmissionCommentsRouter.routes());

console.log("Listening on 8000");

await app.listen({ port: 8000 });
