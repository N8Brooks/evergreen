import {
  COOKIE_USER_NAME,
  httpErrors,
  log,
  Router,
  RouterContext,
  superstruct,
  VoteSortKeysBuilder,
} from "../../deps.ts";
import { submissionCreatedPublisher } from "../../events/submission_created_publisher.ts";
import { submissions } from "../../models/submissions.ts";
import { topics } from "../../models/topics.ts";

const router = new Router();

const { size, define, object, string } = superstruct;

/** Borrow URL api for checking if a url is valid. */
const ValidUrl = define("ValidUrl", (url: unknown) => {
  if (typeof url !== "string") {
    return false;
  }
  if (url.length < 4 || 2048 < url.length) {
    return false;
  }
  try {
    new URL(url);
  } catch {
    return false;
  }
  return true;
});

const CreateSubmissionRequest = object({
  title: size(string(), 1, 256),
  url: ValidUrl,
});

const createSubmissionRoute = async (
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
  const topic = await topics.findOne({ name: topicName });
  if (!topic) {
    throw new httpErrors.NotFound("Topic does not exist");
  }

  const [language] = context.request.acceptsLanguages() ?? [];

  const createdAt = Date.now();
  const id = await submissions.insertOne({
    createdAt,
    language,
    topicName,
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
    topicName,
    userName,
    title,
    url,
  });

  context.response.body = { id };
  context.response.status = 201;
};

const createSubmissionRouter = new Router().post(
  "/api/topics/:topicName/submissions",
  createSubmissionRoute,
);

export { createSubmissionRouter };
