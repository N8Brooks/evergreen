import { LANGUAGES, Router, VoteSortKeysBuilder } from "../../deps.ts";
import { submissionCreatedPublisher } from "../../events/submission_created_publisher.ts";
import { submissions } from "../../models/submissions.ts";
import { topics } from "../../models/topics.ts";

const router = new Router();

router.post("/api/topics/:topicName/submissions", async (context) => {
  const { params, request, response } = context;
  const result = request.body();
  if (result.type !== "json") {
    console.error("That was not json");
    response.status = 400;
    return;
  }

  const { topicName } = params;

  if (!topicName) {
    console.error("No topic name");
    response.status = 400;
    return;
  }

  const topic = await topics.findOne({
    name: topicName,
  });

  if (!topic) {
    console.error("Topic name does not exist");
    response.status = 404;
    return;
  }

  const {
    name,
    url,
    userId,
    language,
  } = await result.value;

  if (!name) {
    console.error("Empty name");
    response.status = 400;
    return;
  }

  try {
    if (url) {
      new URL(url);
    }
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

  if (!LANGUAGES.has(language)) {
    console.error("Unknown language");
    response.status = 400;
    return;
  }

  const createdAt = new Date();
  const topicId = topic._id;
  const id = await submissions.insertOne({
    createdAt,
    language,
    topicId,
    userId,
    name,
    url,
    commentCount: 0,
    ...VoteSortKeysBuilder.default,
  }) as string;

  submissionCreatedPublisher.publish({
    id,
    createdAt,
    language,
    topicId,
    userId,
    name,
    url,
  });

  response.body = { id };
  response.status = 201;
});

export { router as createSubmissionRouter };
