import { Application } from "./deps.ts";
import { createTopicRouter } from "./routes/create.ts";
import { listTopicRouter } from "./routes/list.ts";

const app = new Application();

app.use(createTopicRouter.routes());
app.use(listTopicRouter.routes());

console.log("Listening on 8000!");

await app.listen({ port: 8000 });
