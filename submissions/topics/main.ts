import { Application } from "./deps.ts";
import { createTopicRouter } from "./routes/create.ts";
import { listTopicsRouter } from "./routes/list.ts";

const app = new Application();

app.use(createTopicRouter.routes());
app.use(listTopicsRouter.routes());

console.log("Listening on 8000!");

await app.listen({ port: 8000 });