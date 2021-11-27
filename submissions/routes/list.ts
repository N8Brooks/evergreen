import { Router } from "../deps.ts";
import { submissions } from "../models/submissions.ts";

const router = new Router();

router.get("/api/submissions", async ({ response }) => {
  // TODO: truncate results
  response.body = await submissions.find().toArray();
});

export { router as listSubmissionsRouter };