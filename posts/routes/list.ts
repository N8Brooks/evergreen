import { Router } from "../deps.ts";
import { posts } from "../models/post.ts";

const router = new Router();

router.get("/api/posts", async ({ response }) => {
  response.body = await posts.find().toArray();
});

export { router as listPostRouter };
