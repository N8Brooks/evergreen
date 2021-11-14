import { Router } from "../deps.ts";
import { topics } from "../models/topic.ts";

const router = new Router();

router.get("/api/topics", async ({ response }) => {
  response.body = await topics.find().toArray();
});

export { router as listTopicRouter };
