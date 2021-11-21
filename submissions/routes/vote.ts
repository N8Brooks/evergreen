import { Bson, Router, VoteDirections } from "../deps.ts";
import { submissions } from "../models/submissions.ts";

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

  const { direction } = await result.value;
  switch (direction) {
    case VoteDirections.DownVote:
      submissions.updateOne(
        filter,
        { $set: { downVotes: submission.downVotes + 1 } },
      );
      break;
    case VoteDirections.Abstain:
      // May reverse previous vote in the future
      break;
    case VoteDirections.UpVote:
      submissions.updateOne(
        filter,
        { $set: { upVotes: submission.upVotes + 1 } },
      );
      break;
    default:
      console.error("Invalid vote direction");
      response.status = 400;
      return;
  }

  response.body = {};
});

export { router as voteSubmissionRouter };
