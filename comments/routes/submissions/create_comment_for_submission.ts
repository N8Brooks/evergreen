import {
  COOKIE_USER_NAME,
  httpErrors,
  log,
  RouterContext,
  superstruct,
  VoteSortKeysBuilder,
} from "../../deps.ts";
import { commentCreatedPublisher } from "../../events/comment_created_publisher.ts";
import { comments } from "../../models/comments.ts";
import { submissions } from "../../models/submissions.ts";
import { CreateCommentData } from "../create_comment_data.ts";

const createCommentForSubmission = async (
  context: RouterContext<"/api/submissions/:submissionId/comments">,
) => {
  // Get user name or throw 401
  const userName = await context.cookies.get(COOKIE_USER_NAME);
  if (!userName) {
    throw new httpErrors.Unauthorized("Sign in first");
  }
  const userId = userName.toLowerCase();

  // Retrieve data or throw 400
  const result = context.request.body();
  const data = await result.value;
  superstruct.assert(data, CreateCommentData);
  const { text } = data;

  // Get submission or throw 404
  const { submissionId } = context.params;
  const submission = await submissions.findOne({ _id: submissionId });
  if (!submission) {
    throw new httpErrors.NotFound("Submission does not exist");
  }
  const { _id: topicId, topicName } = submission;

  // Insert comment record
  const createdAt = Date.now();
  const [language] = context.request.acceptsLanguages() ?? [];
  const _id = await comments.insertOne({
    createdAt,
    language,
    topicId,
    topicName,
    userId,
    userName,
    submissionId,
    text,
    ...VoteSortKeysBuilder.default,
  });
  const id = _id.toString();

  // Debug
  log.debug(`User ${userName} commented ${id} on submission ${submissionId}`);

  // Publish event
  commentCreatedPublisher.publish({
    id,
    createdAt,
    language,
    topicId,
    topicName,
    userId,
    userName,
    submissionId,
    text,
  });

  // Respond
  context.response.body = { id };
  context.response.status = 201;
};

export { createCommentForSubmission };
