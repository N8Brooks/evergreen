import { Router } from "../deps.ts";
import { comments } from "../models/comment.ts";

const router = new Router();

router.post("/api/comments", async ({ request, response }) => {
  const result = request.body();
  if (result.type !== "json") {
    console.error("That was not json");
    return;
  }

  const {
    postId,
    body,
  } = await result.value;

  if (!postId) {
    console.error("No parent post");
    return;
  }

  if (!body) {
    console.log("No comment body");
    return;
  }

  await comments.insertOne({
    upVotes: 1,
    downVotes: 0,
    postId,
    body,
  });

  response.status = 201;
});

export { router as createCommentRouter };
