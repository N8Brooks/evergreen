import { LANGUAGES, Router, VoteSortKeysBuilder } from "../../deps.ts";
import { commentCreatedPublisher } from "../../events/comment_created_publisher.ts";
import { comments } from "../../models/comments.ts";

const router = new Router();

router.post("/api/comments/:commentId/comments", async (context) => {
  const { request, response, params } = context;

  const result = request.body();
  if (result.type !== "json") {
    console.error("That was not json");
    response.status = 400;
    return;
  }

  const parentId = params?.commentId;

  if (!parentId) {
    console.error("No parent comment");
    response.status = 400;
    return;
  }

  const parent = await comments.findOne({ _id: parentId });
  if (!parent) {
    console.error("No existing parent comment");
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
  const { topicId, submissionId } = parent;
  const id = await comments.insertOne({
    createdAt,
    language,
    topicId,
    userId,
    parentId,
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
    parentId,
    submissionId,
    text,
  });

  response.body = { id };
  response.status = 201;
});

export { router as createCommentCommentRouter };
