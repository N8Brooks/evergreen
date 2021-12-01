import {
  Bson,
  COOKIE_USER_NAME,
  httpErrors,
  log,
  RouterContext,
  superstruct,
  VoteSortKeysBuilder,
} from "../../deps.ts";
import { commentCreatedPublisher } from "../../events/comment_created_publisher.ts";
import { comments } from "../../models/comments.ts";

const { size, object, string } = superstruct;

const CreateCommentForCommentData = object({
  text: size(string(), 0, 1024),
});

const createCommentForComment = async (
  context: RouterContext<"/api/comments/:commentId/comments">,
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
  superstruct.assert(data, CreateCommentForCommentData);
  const { text } = data;

  // Retrieve parent comment or throw 404
  const parentId = context.params.commentId;
  const parent = await comments.findOne({ _id: new Bson.ObjectId(parentId) });
  if (!parent) {
    throw new httpErrors.NotFound("Parent comment does not exist");
  }
  const { topicId, topicName, submissionId } = parent;

  // Create record
  const createdAt = Date.now();
  const [language] = context.request.acceptsLanguages() ?? [];
  const _id = await comments.insertOne({
    createdAt,
    language,
    topicId,
    topicName,
    userId,
    userName,
    parentId,
    submissionId,
    text,
    ...VoteSortKeysBuilder.default,
  });
  const id = _id.toString();

  // Debug
  log.debug(`User ${userName} commented ${id} on comment ${parentId}`);

  // Publish event
  commentCreatedPublisher.publish({
    id,
    createdAt,
    language,
    topicName,
    topicId,
    userName,
    userId,
    parentId,
    submissionId,
    text,
  });

  // Respond
  context.response.body = { id };
  context.response.status = 201;
};

export { createCommentForComment };
