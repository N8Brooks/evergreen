import { Router } from "../../deps.ts";
import { submissions } from "../../models/submissions.ts";

const router = new Router();

router.get(
  "/api/topics/:topicName/submissions",
  async ({ params, response }) => {
    const { topicName } = params;

    // TODO: check if topic exists here

    if (!topicName) {
      console.error("No parent topic name");
      response.status = 400;
      return;
    }

    response.body = await submissions.find({ topicName }).toArray();
  },
);

export { router as listSubmissionsRouter };
