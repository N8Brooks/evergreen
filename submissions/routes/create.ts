import { Router } from "../deps.ts";
import { submissions } from "../models/submissions.ts";

const router = new Router();

router.post("/api/topics/:topicId/submissions", async (context) => {
  const { params, request, response } = context;
  const result = request.body();
  if (result.type !== "json") {
    console.error("That was not json");
    return;
  }

  const topicId = params?.topicId;

  if (!topicId) {
    console.error("No parent topic");
    return;
  }

  const {
    title,
    url,
  } = await result.value;

  if (!title) {
    console.error("Empty title");
    return;
  }

  try {
    new URL(url);
  } catch {
    console.error("Invalid url");
    return;
  }

  await submissions.insertOne({
    upVotes: 1,
    downVotes: 0,
    topicId,
    title,
    url,
  });

  response.status = 201;
});

export { router as createSubmissionRouter };
