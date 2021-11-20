import { Application } from "./deps.ts";
import { createUserRouter } from "./routes/create.ts";
import { listUsersRouter } from "./routes/list.ts";

const app = new Application();

app.use(createUserRouter.routes());
app.use(listUsersRouter.routes());

console.log("Listening on 8000!");

await app.listen({ port: 8000 });
