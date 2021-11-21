import { Router } from "../../deps.ts";
import { comments } from "../../models/comments.ts";

const router = new Router();

router.post("/api/comments/:commentId/comments", async (context) => {
  const { request, response, params } = context;

  const result = request.body();
  if (result.type !== "json") {
    console.error("That was not json");
    response.status = 400;
    return;
  }

  const parentCommentId = params?.commentId;

  if (!parentCommentId) {
    console.error("No parent comment");
    response.status = 400;
    return;
  }

  const { body, userId } = await result.value;

  if (!body) {
    console.error("No comment body");
    response.status = 400;
    return;
  }

  if (!userId) {
    console.error("No comment author");
    response.status = 400;
    return;
  }

  const id = await comments.insertOne({
    upVotes: 1,
    downVotes: 0,
    commentIds: [],
    userId,
    submissionId: "",
    parentId: parentCommentId,
    body,
  });

  response.body = { id };
  response.status = 201;
});

export { router as createCommentCommentRouter };
