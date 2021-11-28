import { LANGUAGES, log, Router, VoteSortKeysBuilder } from "../../deps.ts";
import { submissionCreatedPublisher } from "../../events/submission_created_publisher.ts";
import { submissions } from "../../models/submissions.ts";
import { topics } from "../../models/topics.ts";

const router = new Router();

router.post("/api/topics/:topicName/submissions", async (context) => {
  const { params, request, response } = context;
  const result = request.body();
  if (result.type !== "json") {
    log.warning("That was not json");
    response.status = 400;
    return;
  }

  const { topicName } = params;

  if (!topicName) {
    log.warning("No topic name");
    response.status = 400;
    return;
  }

  const topic = await topics.findOne({
    name: topicName,
  });

  if (!topic) {
    log.warning("Topic name does not exist");
    response.status = 404;
    return;
  }

  const {
    title,
    url,
    userName,
    language,
  } = await result.value;

  if (!title) {
    log.warning("Empty title");
    response.status = 400;
    return;
  }

  try {
    if (url) {
      new URL(url);
    }
  } catch {
    log.warning("Invalid url");
    response.status = 400;
    return;
  }

  if (!userName) {
    log.warning("No user name");
    response.status = 400;
    return;
  }

  if (!LANGUAGES.has(language)) {
    log.warning("Unknown language");
    response.status = 400;
    return;
  }

  const createdAt = new Date();
  const id = await submissions.insertOne({
    createdAt,
    language,
    topicName,
    userName,
    title,
    url,
    commentCount: 0,
    ...VoteSortKeysBuilder.default,
  }) as string;

  log.debug(`User ${userName} submitted ${id} on topic ${topicName}`);
  submissionCreatedPublisher.publish({
    id,
    createdAt,
    language,
    topicName,
    userName,
    title,
    url,
  });

  response.body = { id };
  response.status = 201;
});

export { router as createSubmissionRouter };
