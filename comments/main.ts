import { Application } from "./deps.ts";
import { listCommentsRouter } from "./routes/list.ts";
import { newCommentRouter } from "./routes/new.ts";

const app = new Application();

app.use(newCommentRouter.routes());
app.use(listCommentsRouter.routes());

console.log("Listening on 8000");

await app.listen({ port: 8000 });
