import { Application, errorHandler, log, Router } from "./deps.ts";
import { commentVotedSubscriber } from "./events/comment_voted_subscriber.ts";
import { submissionVotedSubscriber } from "./events/submission_voted_subscriber.ts";
import { topicHandler } from "./routes/topic_handler.ts";

commentVotedSubscriber.listen();
submissionVotedSubscriber.listen();

const topicsRouter = new Router()
  .use("/api/topics", topicHandler.routes());

const app = new Application()
  .use(errorHandler)
  .use(topicsRouter.routes());

log.info("Listening on 8000!");

await app.listen({ port: 8000 });
