import {
  COOKIE_USER_NAME,
  httpErrors,
  log,
  RouterContext,
  superstruct,
} from "../deps.ts";
import { topicCreatedPublisher } from "../events/topic_created_publisher.ts";
import { topics } from "../models/topics.ts";

const { size, pattern, string } = superstruct;

const CreateTopicRequest = superstruct.object({
  description: size(string(), 0, 1024),
  name: pattern(string(), /^\w{1,32}$/),
});

const createTopicRoute = async (context: RouterContext<"/api/topics">) => {
  const result = context.request.body();
  const data = await result.value;

  superstruct.assert(data, CreateTopicRequest);
  const {
    description,
    name,
  } = data;

  const userName = await context.cookies.get(COOKIE_USER_NAME);
  if (!userName) {
    throw new httpErrors.Unauthorized("Sign in first");
  }

  const id = name.toLowerCase();
  const existingTopic = await topics.findOne({ _id: id });
  if (existingTopic) {
    throw new httpErrors.BadRequest("A topic already exists with that name");
  }

  const createdAt = Date.now();
  const userId = userName.toLowerCase();
  await topics.insertOne({
    _id: id,
    createdAt,
    description,
    name,
    userId,
    commentScore: 0,
    submissionScore: 0,
  });

  log.debug(`User ${userName} created topic ${name}`);
  topicCreatedPublisher.publish({
    id,
    createdAt,
    name,
    userId,
    description,
  });

  context.response.status = 201;
};

export { createTopicRoute };
