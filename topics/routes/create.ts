import { Router } from "../deps.ts";
import { topics } from "../models/topic.ts";

const router = new Router();

router.post("/api/topics", async ({ request, response }) => {
  const result = request.body();
  if (result.type !== "json") {
    console.error("That was not json");
    return;
  }

  const {
    name,
  } = await result.value;

  if (!name) {
    console.error("Empty name");
    return;
  }

  await topics.insertOne({
    upVotes: 0,
    downVotes: 0,
    name,
  });

  response.status = 201;
});

export { router as createTopicRouter };
