import { RouterContext } from "../deps.ts";
import { submissions } from "../models/submissions.ts";

const listSubmissionsRoute = async (
  context: RouterContext<"/api/submissions">,
) => {
  // TODO: truncate results
  context.response.body = await submissions.find().toArray();
};

export { listSubmissionsRoute };
