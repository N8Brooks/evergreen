import { log, Router, VoteSortKeysBuilder } from "../../deps.ts";
import { commentCreatedPublisher } from "../../events/comment_created_publisher.ts";
import { comments } from "../../models/comments.ts";

const router = new Router();

router.post("/api/comments/:commentId/comments", async (context) => {
  const { request, response, params } = context;

  const result = request.body();
  if (result.type !== "json") {
    log.warning("That was not json");
    response.status = 400;
    return;
  }

  const parentId = params?.commentId;

  if (!parentId) {
    log.warning("No parent comment");
    response.status = 400;
    return;
  }

  const parent = await comments.findOne({ _id: parentId });
  if (!parent) {
    log.warning("No existing parent comment");
    response.status = 404;
    return;
  }

  const { text, userName, language } = await result.value;
  const userId = userName.toLowerCase();

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
  const { topicName, topicId, submissionId } = parent;
  const id = await comments.insertOne({
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
  }) as string;

  log.debug(`User ${userName} commented ${id} on comment ${parentId}`);
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

  response.body = { id };
  response.status = 201;
});

export { router as createCommentCommentRouter };
