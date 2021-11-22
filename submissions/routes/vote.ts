import { Bson, Router, VoteDirections } from "../deps.ts";
import { submissionVotedPublisher } from "../events.ts/submission_voted_publisher.ts";
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
  const submissionFilter = { _id: new Bson.ObjectId(submissionId) };
  const submission = await submissions.findOne(submissionFilter);
  if (!submission) {
    console.error("Submission does not exist");
    response.status = 400;
    return;
  }

  const { direction: newVoteDirection, userId: anyUserId } = await result.value;
  const userId = anyUserId as string;
  if (!userId) {
    console.error("No user id");
    response.status = 400;
    return;
  }

  const oldVoteDirection = submission.votes[userId] ?? VoteDirections.NoVote;
  if (oldVoteDirection === newVoteDirection) {
    console.error("Vote direction must change");
    response.status = 400;
    return;
  }

  const submissionPatch = {
    upVotes: submission.upVotes,
    downVotes: submission.downVotes,
    votes: {
      ...submission.votes,
      [userId]: newVoteDirection,
    },
  };

  // Remove previous vote
  switch (oldVoteDirection) {
    case (VoteDirections.DownVote):
      submissionPatch.downVotes--;
      break;
    case (VoteDirections.UpVote):
      submissionPatch.upVotes--;
      break;
  }

  // Add new vote
  switch (newVoteDirection) {
    case (VoteDirections.DownVote):
      submissionPatch.downVotes++;
      break;
    case (VoteDirections.NoVote):
      delete submissionPatch.votes[userId];
      break;
    case (VoteDirections.UpVote):
      submissionPatch.upVotes++;
      break;
    default:
      console.log("Invalid vote direction");
      response.status = 400;
      return;
  }

  // Update votes
  submissions.updateOne(
    submissionFilter,
    { $set: submissionPatch },
  );

  // Publish message
  submissionVotedPublisher.publish({
    id: submissionId,
    direction: newVoteDirection,
  });

  response.body = {};
});

export { router as voteSubmissionRouter };
