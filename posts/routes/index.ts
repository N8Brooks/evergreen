import { Router } from "../deps.ts";

const router = new Router();

router.get("/api/posts", ({ response }) => {
  response.body = "list of posts";
});

export { router as postsRouter };
