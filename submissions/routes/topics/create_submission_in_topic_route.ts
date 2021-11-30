import {
  COOKIE_USER_NAME,
  httpErrors,
  log,
  RouterContext,
  superstruct,
  URI_PATTERN,
  VoteSortKeysBuilder,
} from "../../deps.ts";
import { submissionCreatedPublisher } from "../../events/submission_created_publisher.ts";
import { submissions } from "../../models/submissions.ts";
import { topics } from "../../models/topics.ts";

const { size, define, object, string } = superstruct;

const CreateSubmissionRequest = object({
  title: size(string(), 1, 256),
  url: define("validUrl", (url: unknown) => {
    if (typeof url !== "string") {
      return false;
    }
    if (!URI_PATTERN.test(url)) {
      return false;
    }
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  }),
});

const createSubmissionInTopicRoute = async (
  context: RouterContext<"/api/topics/:topicName/submissions">,
) => {
  const userName = await context.cookies.get(COOKIE_USER_NAME);
  if (!userName) {
    throw new httpErrors.Unauthorized("Sign in first");
  }

  const result = context.request.body();
  const data = await result.value;

  superstruct.assert(data, CreateSubmissionRequest);
  const { title } = data;
  const url = data.url as string;

  const { topicName } = context.params;
  const topicId = topicName.toLowerCase();

  const topic = await topics.findOne({ _id: topicId });
  if (!topic) {
    throw new httpErrors.NotFound("Topic does not exist");
  }

  const createdAt = Date.now();
  const [language] = context.request.acceptsLanguages() ?? [];
  const userId = userName.toLowerCase();
  const id = await submissions.insertOne({
    createdAt,
    language,
    topicId,
    topicName,
    userId,
    userName,
    title,
    url,
    commentCount: 0,
    ...VoteSortKeysBuilder.default,
  }) as string;

  log.debug(`User ${userName} submitted ${id} on topic ${topicName}`);
  submissionCreatedPublisher.publish({
    id,
    createdAt,
    language,
    topicId,
    topicName,
    userId,
    userName,
    title,
    url,
  });

  context.response.body = { id };
  context.response.status = 201;
};

export { createSubmissionInTopicRoute };
