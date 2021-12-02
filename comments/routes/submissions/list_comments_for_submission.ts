import { httpErrors, RouterContext } from "../../deps.ts";
import { comments } from "../../models/comments.ts";
import { submissions } from "../../models/submissions.ts";

const listCommentsForSubmission = async (
  context: RouterContext<"/api/submissions/:submissionId/comments">,
) => {
  // Comment exists or throw 404
  const { submissionId } = context.params;
  const submission = await submissions.findOne({ _id: submissionId });
  if (!submission) {
    throw new httpErrors.NotFound("Comment does not exist");
  }

  // TODO: truncate results

  // Return 200 with comments
  context.response.body = await comments
    .find({ submissionId })
    .toArray();
};

export { listCommentsForSubmission };
