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

  const id = await users.insertOne({
    createdAt: new Date(),
    name,
    upVotes: 0,
    downVotes: 0,
  });

  userCreatedPublisher.publish({
    id: `${id}`,
    name,
  });

  response.body = { id };
  response.status = 201;
});

export { router as createUserRouter };
