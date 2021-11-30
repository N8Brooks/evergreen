import { httpErrors, RouterContext } from "../../deps.ts";
import { submissions } from "../../models/submissions.ts";
import { topics } from "../../models/topics.ts";

const listSubmissionInTopicRoute = async (
  context: RouterContext<"/api/topics/:topicName/submissions">,
) => {
  const { topicName } = context.params;
  const topicId = topicName.toLowerCase();

  const topic = topics.findOne({ _id: topicId });
  if (!topic) {
    throw new httpErrors.NotFound("Topic does not exist");
  }

  // TODO: truncate results

  context.response.body = await submissions.find({ _id: topicId }).toArray();
};

export { listSubmissionInTopicRoute };
