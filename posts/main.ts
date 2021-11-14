import { listPostRouter } from "./routes/list.ts";
import { createPostRouter } from "./routes/create.ts";
import { Application } from "./deps.ts";

const app = new Application();

app.use(listPostRouter.routes());
app.use(createPostRouter.routes());

console.log("Listening on 8000");

await app.listen({ port: 8000 });
