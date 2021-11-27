import { log, Router } from "../deps.ts";
import { topicCreatedPublisher } from "../events/topic_created_publisher.ts";
import { topics } from "../models/topics.ts";

const router = new Router();

router.post("/api/topics", async ({ request, response }) => {
  const result = request.body();
  if (result.type !== "json") {
    log.warning("That was not json");
    response.status = 400;
    return;
  }

  const {
    description,
    name,
    userName,
  } = await result.value;

  if (!description) {
    log.warning("Empty description");
    response.status = 400;
    return;
  }

  if (!name) {
    log.warning("Empty name");
    response.status = 400;
    return;
  }

  if (!userName) {
    log.warning("No topic author");
    response.status = 400;
    return;
  }

  const createdAt = new Date();
  const id = await topics.insertOne({
    createdAt,
    description,
    name,
    userName,
    commentScore: 0,
    submissionScore: 0,
  }) as string;

  topicCreatedPublisher.publish({
    createdAt,
    name,
    userName,
    description,
  });

  response.body = { id };
  response.status = 201;
});

export { router as createTopicRouter };
