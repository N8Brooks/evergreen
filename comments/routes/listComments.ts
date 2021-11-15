import { Router } from "../deps.ts";
import { comments } from "../models/comments.ts";

const router = new Router();

router.get("/api/submissions/:submissionId/comments", async (context) => {
  const { response, params } = context;
  const submissionId = params?.submissionId;

  if (!submissionId) {
    console.error("No parent submission");
    return;
  }

  response.body = await comments.find({ submissionId }).toArray();
});

export { router as listCommentsRouter };
