import { Router } from "../deps.ts";
import { topicCreatedPublisher } from "../events/topic_created_publisher.ts";
import { topics } from "../models/topics.ts";

const router = new Router();

router.post("/api/topics", async ({ request, response }) => {
  const result = request.body();
  if (result.type !== "json") {
    console.error("That was not json");
    response.status = 400;
    return;
  }

  const {
    description,
    name,
    userId,
  } = await result.value;

  if (!description) {
    console.error("Empty description");
    response.status = 400;
    return;
  }

  if (!name) {
    console.error("Empty name");
    response.status = 400;
    return;
  }

  if (!userId) {
    console.error("No topic author");
    response.status = 400;
    return;
  }

  const createdAt = new Date();
  const id = await topics.insertOne({
    createdAt,
    description,
    name,
    userId,
    commentScore: 0,
    submissionScore: 0,
  }) as string;

  topicCreatedPublisher.publish({
    id,
    createdAt,
    description,
    name,
    userId,
  });

  response.body = { id };
  response.status = 201;
});

export { router as createTopicRouter };
