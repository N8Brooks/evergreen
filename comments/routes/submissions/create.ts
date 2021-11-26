import { LANGUAGES, Router, VoteSortKeysBuilder } from "../../deps.ts";
import { commentCreatedPublisher } from "../../events/comment_created_publisher.ts";
import { comments } from "../../models/comments.ts";
import { submissions } from "../../models/submissions.ts";

const router = new Router();

router.post("/api/submissions/:submissionId/comments", async (context) => {
  const { request, response, params } = context;

  const result = request.body();
  if (result.type !== "json") {
    console.error("That was not json");
    response.status = 400;
    return;
  }

  const { submissionId } = params;

  if (!submissionId) {
    console.error("No parent submission");
    response.status = 400;
    return;
  }

  const submission = await submissions.findOne({ _id: submissionId });
  if (!submission) {
    console.error("Submission with that id does not exist");
    response.status = 404;
    return;
  }

  const { text, userId, language } = await result.value;

  if (!text) {
    console.error("No comment text");
    response.status = 400;
    return;
  }

  if (!userId) {
    console.error("No comment author");
    response.status = 400;
    return;
  }

  if (!LANGUAGES.has(language)) {
    console.error("Unknown language");
    response.status = 400;
    return;
  }

  const createdAt = new Date();
  const { topicId } = submission;
  const id = await comments.insertOne({
    createdAt,
    language,
    topicId,
    userId,
    submissionId,
    text,
    ...VoteSortKeysBuilder.default,
  }) as string;

  commentCreatedPublisher.publish({
    id,
    createdAt,
    language,
    topicId,
    userId,
    submissionId,
    text,
  });

  response.body = { id };
  response.status = 201;
});

export { router as createSubmissionCommentRouter };
