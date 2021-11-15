import { Router } from "../deps.ts";
import { submissions } from "../models/submissions.ts";

const router = new Router();

router.get("/api/topics/:topicId/submissions", async ({ params, response }) => {
  const topicId = params?.topicId;

  if (!topicId) {
    console.error("No parent topic");
    return;
  }

  response.body = await submissions.find({ topicId }).toArray();
});

export { router as listSubmissionsRouter };
