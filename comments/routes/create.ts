import { Router } from "../deps.ts";
import { comments } from "../models/comment.ts";

const router = new Router();

router.post(
  "/api/posts/:postId",
  async ({ request, response, params }) => {
    const result = request.body();
    if (result.type !== "json") {
      console.error("That was not json");
      return;
    }

    const postId = params?.postId;

    if (!postId) {
      console.error("No parent post");
      return;
    }

    const { body } = await result.value;

    if (!body) {
      console.log("No comment body");
      return;
    }

    await comments.insertOne({
      upVotes: 1,
      downVotes: 0,
      postId,
      body,
    });

    response.status = 201;
  },
);

export { router as createCommentRouter };
