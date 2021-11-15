import { Router } from "../../deps.ts";
import { comments } from "../../models/comments.ts";

const router = new Router();

router.get("/api/comments/:commentId/comments", async (context) => {
  const { response, params } = context;
  const commentId = params?.commentId;

  if (!commentId) {
    console.error("No parent comment");
    return;
  }

  response.body = await comments.find({ parentId: commentId }).toArray();
});

export { router as listCommentCommentsRouter };
