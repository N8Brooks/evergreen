import { log, Router, VoteSortKeysBuilder } from "../../deps.ts";
import { commentCreatedPublisher } from "../../events/comment_created_publisher.ts";
import { comments } from "../../models/comments.ts";
import { submissions } from "../../models/submissions.ts";

const router = new Router();

router.post("/api/submissions/:submissionId/comments", async (context) => {
  const { request, response, params } = context;

  const result = request.body();
  if (result.type !== "json") {
    log.warning("That was not json");
    response.status = 400;
    return;
  }

  const { submissionId } = params;

  if (!submissionId) {
    log.warning("No parent submission");
    response.status = 400;
    return;
  }

  const submission = await submissions.findOne({ _id: submissionId });
  if (!submission) {
    log.warning("Submission with that id does not exist");
    response.status = 404;
    return;
  }

  const { text, userName, language } = await result.value;

  if (!text) {
    log.warning("No comment text");
    response.status = 400;
    return;
  }

  if (!userName) {
    log.warning("No comment author");
    response.status = 400;
    return;
  }

  const createdAt = Date.now();
  const { topicName } = submission;
  const id = await comments.insertOne({
    createdAt,
    language,
    topicName,
    userName,
    submissionId,
    text,
    ...VoteSortKeysBuilder.default,
  }) as string;

  log.debug(`User ${userName} commented ${id} on submission ${submissionId}`);
  commentCreatedPublisher.publish({
    id,
    createdAt,
    language,
    topicName,
    userName,
    submissionId,
    text,
  });

  response.body = { id };
  response.status = 201;
});

export { router as createSubmissionCommentRouter };
