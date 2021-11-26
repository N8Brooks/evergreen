import { Router } from "../deps.ts";
import { users } from "../models/users.ts";

const router = new Router();

router.get("/api/users", async ({ response }) => {
  // TODO: truncate results
  response.body = await users.find().toArray();
});

export { router as listUsersRouter };
