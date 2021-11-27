import { log, Router } from "../../deps.ts";
import { submissions } from "../../models/submissions.ts";

const router = new Router();

router.get(
  "/api/topics/:topicName/submissions",
  async ({ params, response }) => {
    const { topicName } = params;

    // TODO: check if topic exists here

    if (!topicName) {
      log.warning("No parent topic name");
      response.status = 400;
      return;
    }

    // TODO: truncate results

    response.body = await submissions.find({ topicName }).toArray();
  },
);

export { router as listSubmissionsByTopicRouter };
