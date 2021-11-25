import { VoteSortKeysBuilder } from "../deps.ts";
import { Bson, Router } from "../deps.ts";
import { submissionCreatedPublisher } from "../events/submission_created_publisher.ts";
import { submissions } from "../models/submissions.ts";
import { topics } from "../models/topics.ts";

const router = new Router();

router.post("/api/topics/:topicName/submissions", async (context) => {
  const { params, request, response } = context;
  const result = request.body();
  if (result.type !== "json") {
    console.error("That was not json");
    response.status = 400;
    return;
  }

  const topicName = params?.topicName;

  if (!topicName) {
    console.error("No topic name");
    response.status = 400;
    return;
  }

  const topic = await topics.findOne({
    topicName,
  });

  if (!topic) {
    console.error("Topic name does not exist");
    response.status = 404;
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

  const topicId = topic._id.toString();
  const objectId = await submissions.insertOne({
    ...VoteSortKeysBuilder.default,
    topicId,
    userId,
    title,
    url,
  }) as Bson.ObjectId;
  const id = objectId.toHexString();

  submissionCreatedPublisher.publish({
    id,
    topicId,
    userId,
    title,
    url,
  });

  response.body = { id };
  response.status = 201;
});

export { router as createSubmissionRouter };
