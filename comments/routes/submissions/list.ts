import { log, Router } from "../../deps.ts";
import { comments } from "../../models/comments.ts";

const router = new Router();

router.get("/api/submissions/:submissionId/comments", async (context) => {
  // TODO: truncate results

  const { response, params } = context;
  const submissionId = params?.submissionId;

  if (!submissionId) {
    log.warning("No parent submission");
    response.status = 400;
    return;
  }

  // TODO: check if submission even exists

  response.body = await comments.find({ submissionId }).toArray();
});

export { router as listSubmissionCommentsRouter };
