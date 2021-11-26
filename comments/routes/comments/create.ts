import { LANGUAGES, Router, VoteSortKeysBuilder } from "../../deps.ts";
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

  const id = await comments.insertOne({
    createdAt: new Date(),
    language,
    topicId: "_placeholder", // TODO: this is a placeholder
    userId,
    parentId,
    submissionId: "_placeholder", // TODO: this is a placeholder
    text,
    ...VoteSortKeysBuilder.default,
  });

  response.body = { id };
  response.status = 201;
});

export { router as createCommentCommentRouter };
