import { Router } from "../deps.ts";
import { posts } from "../models/post.ts";

const router = new Router();

router.post("/api/topics/:topicName", async ({ params, request, response }) => {
  const result = request.body();
  if (result.type !== "json") {
    console.error("That was not json");
    return;
  }

  const topicName = params?.topicName;

  if (!topicName) {
    console.error("No parent topic");
    return;
  }

  const {
    title,
    url,
  } = await result.value;

  if (!title) {
    console.error("Empty title");
    return;
  }

  try {
    new URL(url);
  } catch {
    console.error("Invalid url");
    return;
  }

  await posts.insertOne({
    upVotes: 1,
    downVotes: 0,
    topicName,
    title,
    url,
  });

  response.status = 201;
});

export { router as createPostRouter };
