import { Router } from "../deps.ts";
import { comments } from "../models/comment.ts";

const router = new Router();

router.get("/api/posts/:postId", async ({ response, params }) => {
  const postId = params?.postId;

  if (!postId) {
    console.error("No parent post");
    return;
  }

  response.body = await comments.find({ postId }).toArray();
});

export { router as listCommentsRouter };
