import { RouterContext } from "../deps.ts";
import { topics } from "../models/topics.ts";

const listTopicsRoute = async ({ response }: RouterContext<"/api/topics">) => {
  // TODO: truncate results
  response.body = await topics
    .find()
    .sort({ submissionScore: -1 })
    .toArray();
};

export { listTopicsRoute };
