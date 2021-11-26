import { Router } from "../../deps.ts";
import { submissions } from "../../models/submissions.ts";

const router = new Router();

router.get(
  "/api/users/:userName/submissions",
  async ({ params, response }) => {
    const { userName } = params;

    // TODO: check if user exists here

    if (!userName) {
      console.error("No user name");
      response.status = 400;
      return;
    }

    // TODO: truncate results

    response.body = await submissions.find({ userName }).toArray();
  },
);

export { router as listSubmissionsByUserRouter };
