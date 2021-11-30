import { httpErrors, RouterContext } from "../../deps.ts";
import { submissions } from "../../models/submissions.ts";
import { topics } from "../../models/topics.ts";

const listSubmissionInTopic = async (
  context: RouterContext<"/api/topics/:_topicName/submissions">,
) => {
  const { _topicName } = context.params;
  const topicId = _topicName.toLowerCase();

  const topic = topics.findOne({ _id: topicId });
  if (!topic) {
    throw new httpErrors.NotFound("Topic does not exist");
  }

  // TODO: truncate results

  context.response.body = await submissions.find({ _id: topicId }).toArray();
};

export { listSubmissionInTopic };
