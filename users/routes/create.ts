import { Router } from "../deps.ts";
import { userCreatedPublisher } from "../events/user_created_publisher.ts";
import { users } from "../models/users.ts";

const router = new Router();

router.post("/api/users", async (context) => {
  const { request, response } = context;
  const result = request.body();
  if (result.type !== "json") {
    console.error("That was not json");
    response.status = 400;
    return;
  }

  const {
    name,
  } = await result.value;

  if (!name) {
    console.error("Empty name");
    response.status = 400;
    return;
  }

  const createdAt = new Date();
  const id = await users.insertOne({
    createdAt,
    name,
    commentScore: 0,
    submissionScore: 0,
  }) as string;

  userCreatedPublisher.publish({
    id,
    createdAt,
    name,
  });

  response.body = { id };
  response.status = 201;
});

export { router as createUserRouter };
