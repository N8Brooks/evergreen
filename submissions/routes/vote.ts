import { Bson, Router, VoteDirections } from "../deps.ts";
import { submissionVotedPublisher } from "../events.ts/submission_voted_publisher.ts";
import { submissions } from "../models/submissions.ts";
import { votes } from "../models/votes.ts";

const router = new Router();

const voteDirections = [
  VoteDirections.DownVote,
  VoteDirections.NoVote,
  VoteDirections.UpVote,
];

router.patch("/api/submissions/:submissionId", async (context) => {
  const { request, response, params } = context;
  const result = request.body();
  if (result.type !== "json") {
    console.error("That was not json");
    response.status = 400;
    return;
  }

  let submissionId: Bson.ObjectId;
  try {
    submissionId = new Bson.ObjectId(params.submissionId);
  } catch {
    console.error("Invalid submissionId");
    response.status = 400;
    return;
  }

  const submissionFilter = { _id: submissionId };
  const submission = await submissions.findOne(submissionFilter);
  if (!submission) {
    console.error("Submission does not exist");
    response.status = 400;
    return;
  }

  const { direction: newVoteDirection, userId: anyUserId } = await result.value;

  if (!voteDirections.includes(newVoteDirection)) {
    console.error("Invalid vote direction");
    response.status = 400;
    return;
  }

  let userId: Bson.ObjectId;
  try {
    userId = new Bson.ObjectId(anyUserId);
  } catch {
    console.error("Invalid userId");
    response.status = 400;
    return;
  }

  const voteFilter = { submissionId, userId };
  const vote = await votes.findOne(voteFilter);
  const oldVoteDirection = vote?.direction ?? VoteDirections.NoVote;
  if (oldVoteDirection === newVoteDirection) {
    console.error("The voteDirection must be different");
    response.status = 400;
    return;
  }

  // Update vote
  if (newVoteDirection === VoteDirections.NoVote) {
    votes.deleteOne(voteFilter);
  } else {
    votes.updateOne(voteFilter, { $set: { direction: newVoteDirection } });
  }

  // Update submission vote counts
  const upVotes = submission.upVotes +
    +(newVoteDirection === VoteDirections.UpVote) -
    +(oldVoteDirection === VoteDirections.UpVote);
  const downVotes = submission.downVotes +
    +(newVoteDirection === VoteDirections.DownVote) -
    +(oldVoteDirection === VoteDirections.DownVote);
  submissions.updateOne(
    submissionFilter,
    { $set: { upVotes, downVotes } },
  );

  // Publish message
  submissionVotedPublisher.publish({
    submissionId: submissionId.toHexString(),
    userId: userId.toHexString(),
    direction: newVoteDirection,
  });

  response.body = {};
});

export { router as voteSubmissionRouter };
