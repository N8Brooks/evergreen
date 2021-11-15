import { Router } from "../../deps.ts";
import { comments } from "../../models/comments.ts";

const router = new Router();

router.post("/api/submissions/:submissionId/comments", async (context) => {
  const { request, response, params } = context;

  const result = request.body();
  if (result.type !== "json") {
    console.error("That was not json");
    return;
  }

  const submissionId = params?.submissionId;

  if (!submissionId) {
    console.error("No parent submission");
    return;
  }

  const { body } = await result.value;

  if (!body) {
    console.log("No comment body");
    return;
  }

  await comments.insertOne({
    upVotes: 1,
    downVotes: 0,
    commentIds: [],
    submissionId,
    body,
  });

  response.status = 201;
});

export { router as createSubmissionCommentRouter };
