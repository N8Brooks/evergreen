import { Router } from "../deps.ts";
import { topics } from "../models/topic.ts";

const router = new Router();

router.post("/api/topics", async ({ request, response }) => {
  const result = request.body();
  if (result.type !== "json") {
    console.error("That was not json");
    response.status = 400;
    return;
  }

  const {
    name,
  } = await result.value;

  if (!name) {
    console.error("Empty name");
    response.status = 400;
    return;
  }

  const id = await topics.insertOne({
    upVotes: 0,
    downVotes: 0,
    name,
  });

  response.body = { id };
  response.status = 201;
});

export { router as createTopicRouter };
