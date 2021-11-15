import { listSubmissionsRouter } from "./routes/list.ts";
import { createSubmissionRouter } from "./routes/create.ts";
import { Application } from "./deps.ts";

const app = new Application();

app.use(listSubmissionsRouter.routes());
app.use(createSubmissionRouter.routes());

console.log("Listening on 8000");

await app.listen({ port: 8000 });
