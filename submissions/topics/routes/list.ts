import { Router } from "../deps.ts";
import { topics } from "../models/topics.ts";

const router = new Router();

router.get("/api/topics", async ({ response }) => {
  response.body = await topics.find().toArray();
});

export { router as listTopicsRouter };