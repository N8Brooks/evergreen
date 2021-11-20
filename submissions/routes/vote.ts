import { Bson, Router } from "../deps.ts";
import { submissions } from "../models/submissions.ts";
import { VoteActions } from "../types/vote_actions.ts";

const router = new Router();

router.patch("/api/submissions/:submissionId", async (context) => {
  const { request, response, params } = context;
  const result = request.body();
  if (result.type !== "json") {
    console.error("That was not json");
    response.status = 400;
    return;
  }

  const { submissionId } = params;
  const filter = { _id: new Bson.ObjectId(submissionId) };
  const submission = await submissions.findOne(filter);
  if (!submission) {
    console.error("Submission does not exist");
    response.status = 400;
    return;
  }

  const { action } = await result.value;
  switch (action) {
    case VoteActions.DownVote:
      submissions.updateOne(
        filter,
        { $set: { downVotes: submission.downVotes + 1 } },
      );
      break;
    case VoteActions.Abstain:
      // May reverse previous vote in the future
      break;
    case VoteActions.UpVote:
      submissions.updateOne(
        filter,
        { $set: { upVotes: submission.upVotes + 1 } },
      );
      break;
    default:
      console.error("Invalid vote action");
      response.status = 400;
      return;
  }

  response.body = {};
});

export { router as voteSubmissionRouter };