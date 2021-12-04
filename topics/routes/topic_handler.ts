import {
  httpErrors,
  log,
  NAME_PATTERN,
  requireAuth,
  RequireAuthState,
  Router,
  superstruct,
} from "../deps.ts";
import { topicCreatedPublisher } from "../events/topic_created_publisher.ts";
import { topics } from "../models/topics.ts";

const { size, pattern, string } = superstruct;

const CreateTopicRequest = superstruct.object({
  description: size(string(), 0, 1024),
  name: pattern(string(), NAME_PATTERN),
});

const router = new Router<RequireAuthState>()
  .get("/", async (context) => {
    context.response.body = await topics
      .find()
      .sort({ submissionScore: -1 })
      .toArray();
  })
  .use(requireAuth)
  .post("/", async (context) => {
    const result = context.request.body();
    const data = await result.value;
    superstruct.assert(data, CreateTopicRequest);

    const { name } = data;
    const id = name.toLowerCase();
    const existingTopic = await topics.findOne({ _id: id });
    if (existingTopic) {
      throw new httpErrors.BadRequest("A topic already exists with that name");
    }

    const createdAt = Date.now();
    const { userName, userId } = context.state;
    const { description } = data;
    await topics.insertOne({
      _id: id,
      createdAt,
      description,
      name,
      userId,
      userName,
      commentScore: 0,
      submissionScore: 0,
    });

    log.debug(`User ${userName} created topic ${name}`);
    topicCreatedPublisher.publish({
      id,
      name,
      createdAt,
      userId,
      userName,
      description,
    });

    context.response.body = { id };
    context.response.status = 201;
  });

export { router as topicHandler };
