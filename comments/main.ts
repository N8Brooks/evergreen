import { Application } from "./deps.ts";
import { listCommentsRouter } from "./routes/listComments.ts";
import { createCommentRouter } from "./routes/createComment.ts";

const app = new Application();

app.use(createCommentRouter.routes());
app.use(listCommentsRouter.routes());

console.log("Listening on 8000");

await app.listen({ port: 8000 });
