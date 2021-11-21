import { Router } from "../deps.ts";
import { submissions } from "../models/submissions.ts";

const router = new Router();

router.post("/api/topics/:topicId/submissions", async (context) => {
  const { params, request, response } = context;
  const result = request.body();
  if (result.type !== "json") {
    console.error("That was not json");
    response.status = 400;
    return;
  }

  const topicId = params?.topicId;

  if (!topicId) {
    console.error("No parent topic");
    response.status = 400;
    return;
  }

  const {
    title,
    url,
    userId,
  } = await result.value;

  if (!title) {
    console.error("Empty title");
    response.status = 400;
    return;
  }

  try {
    new URL(url);
  } catch {
    console.error("Invalid url");
    response.status = 400;
    return;
  }

  if (!userId) {
    console.error("No submission author");
    response.status = 400;
    return;
  }

  const id = await submissions.insertOne({
    upVotes: 1,
    downVotes: 0,
    topicId,
    userId,
    title,
    url,
  });

  response.body = { id };
  response.status = 201;
});

export { router as createSubmissionRouter };
