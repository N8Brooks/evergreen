import { Application, errorHandler, log, Router } from "./deps.ts";
import { commentVotedSubscriber } from "./events/comment_voted_subscriber.ts";
import { submissionVotedSubscriber } from "./events/submission_voted_subscriber.ts";
import { signInRoute } from "./routes/sign_in_route.ts";
import { signOutRoute } from "./routes/sign_out_route.ts";
import { signUpRoute } from "./routes/sign_up_route.ts";

commentVotedSubscriber.listen();
submissionVotedSubscriber.listen();

const app = new Application();

app.use(errorHandler);

const usersRouter = new Router()
  .post("/api/users/sign_up", signUpRoute)
  .post("/api/users/sign_in", signInRoute)
  .post("/api/users/sign_out", signOutRoute);

app.use(usersRouter.routes());

log.info("Listening on 8000!");

await app.listen({ port: 8000 });
