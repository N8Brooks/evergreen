import { showPostRouter } from "./routes/show.ts";
import { createPostRouter } from "./routes/new.ts";
import { Application } from "./deps.ts";

const app = new Application();

app.use(showPostRouter.routes());
app.use(createPostRouter.routes());

console.log("Listening on 8000");

await app.listen({ port: 8000 });
