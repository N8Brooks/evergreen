import { httpErrors, RequireAuthState, Router } from "../deps.ts";
import { submissions } from "../models/submissions.ts";
import { topics, TopicSchema } from "../models/topics.ts";

interface SubmissionsInTopicState extends RequireAuthState {
  topic: TopicSchema;
}

/** "/api/topics/:_topicName/submissions" */
const router = new Router()
  .use(async (context, next) => {
    const { _topicName } = context.params;
    const topicId = _topicName.toLowerCase();
    const topic = topics.findOne({ _id: topicId });
    if (!topic) {
      throw new httpErrors.NotFound("Topic does not exist");
    }
    context.state.topic = topic;
    await next();
  })
  .get("/", async (context) => {
    // TODO: truncate results
    const { topicId } = context.state.topic;
    context.response.body = await submissions
      .find({ _id: topicId })
      .toArray();
  });
