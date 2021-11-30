import { RouterContext } from "../../deps.ts";
import { submissions } from "../../models/submissions.ts";

const listSubmissionsByUser = async (
  context: RouterContext<"/api/users/:_userName/submissions">,
) => {
  const { _userName } = context.params;
  const userId = _userName.toLowerCase();

  // TODO: check if user exists

  // TODO: truncate results

  context.response.body = await submissions.find({ userId }).toArray();
};

export { listSubmissionsByUser };
