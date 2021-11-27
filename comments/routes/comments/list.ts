import { log, Router } from "../../deps.ts";
import { comments } from "../../models/comments.ts";

const router = new Router();

router.get("/api/comments/:commentId/comments", async (context) => {
  const { response, params } = context;
  const commentId = params?.commentId;

  if (!commentId) {
    log.warning("No parent comment");
    response.status = 400;
    return;
  }

  // TODO: truncate results

  response.body = await comments.find({ parentId: commentId }).toArray();
});

export { router as listCommentCommentsRouter };
