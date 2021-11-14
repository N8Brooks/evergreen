import { Router } from "../deps.ts";
import { posts } from "../models/post.ts";

const router = new Router();

router.get("/api/topics/:topicName", async ({ params, response }) => {
  const topicName = params?.topicName;

  if (!topicName) {
    console.error("No parent topic");
    return;
  }

  response.body = await posts.find({ topicName }).toArray();
});

export { router as listPostRouter };
