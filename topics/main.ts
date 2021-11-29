import { Application, errorHandler, log, Router } from "./deps.ts";
import { commentVotedSubscriber } from "./events/comment_voted_subscriber.ts";
import { submissionVotedSubscriber } from "./events/submission_voted_subscriber.ts";
import { createTopicRoute } from "./routes/create_topic_route.ts";
import { listTopicsRoute } from "./routes/list_topics_route.ts";

commentVotedSubscriber.listen();
submissionVotedSubscriber.listen();

const topicRouter = new Router()
  .get("/api/topics", listTopicsRoute)
  .post("/api/topics", createTopicRoute);

const app = new Application()
  .use(errorHandler)
  .use(topicRouter.routes());

log.info("Listening on 8000!");

await app.listen({ port: 8000 });
