import { Router } from "../deps.ts";
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

  const id = await topics.insertOne({
    upVotes: 0,
    downVotes: 0,
    description,
    name,
    userId,
  });

  response.body = { id };
  response.status = 201;
});

export { router as createTopicRouter };
