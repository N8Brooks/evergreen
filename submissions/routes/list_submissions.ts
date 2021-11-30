import { RouterContext } from "../deps.ts";
import { submissions } from "../models/submissions.ts";

const listSubmissions = async (
  context: RouterContext<"/api/submissions">,
) => {
  // TODO: truncate results
  context.response.body = await submissions.find().toArray();
};

export { listSubmissions };
