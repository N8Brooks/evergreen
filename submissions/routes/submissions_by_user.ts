import { users } from "../../users/models/users.ts";
import { httpErrors, Router } from "../deps.ts";
import { submissions } from "../models/submissions.ts";

const router = new Router()
  .get("/api/users/:_userName/submissions", async (context) => {
    // Retrieve requested user record
    const { _userName } = context.params;
    const userId = _userName.toLowerCase();
    const user = await users.findOne({ _id: userId });

    // User is defined or throw 404
    if (!user) {
      throw new httpErrors.NotFound("User does not exist");
    }

    // TODO: truncate results

    // Return submissions by user
    context.response.body = await submissions.find({ userId }).toArray();
  });

export { router as submissionsByUser };
