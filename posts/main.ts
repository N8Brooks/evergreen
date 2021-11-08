import { Application } from "./deps.ts";
import { postsRouter } from "./routes/index.ts";

const app = new Application();

app.use(postsRouter.routes());

console.log("Listening on 8000");

await app.listen({ port: 8000 });
