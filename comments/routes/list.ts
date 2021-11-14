import { Router } from "../deps.ts";
import { comments } from "../models/comment.ts";

const router = new Router();

router.get("/api/comments", async ({ response }) => {
  response.body = await comments.find().toArray();
});

export { router as listCommentsRouter };
