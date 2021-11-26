import {
  Bson,
  Router,
  VOTE_DIRECTIONS,
  VoteDirections,
  VoteSortKeysBuilder,
} from "../../deps.ts";
import { submissionVotedPublisher } from "../../events/submission_voted_publisher.ts";
import { submissions } from "../../models/submissions.ts";
import { votes } from "../../models/votes.ts";

const { NoVote } = VoteDirections;

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
  if (!submissionId) {
    console.error("Invalid submissionId");
    response.status = 400;
    return;
  }

  const submissionFilter = { _id: new Bson.ObjectId(submissionId) };
  const submission = await submissions.findOne(submissionFilter);
  if (!submission) {
    console.error("Submission does not exist");
    response.status = 400;
    return;
  }

  const { direction: newVoteDirection, userId } = await result.value;

  if (!VOTE_DIRECTIONS.includes(newVoteDirection)) {
    console.error("Invalid vote direction");
    response.status = 400;
    return;
  }

  if (!userId) {
    console.error("Invalid userId");
    response.status = 400;
    return;
  }

  const voteFilter = { submissionId, userId };
  const vote = await votes.findOne(voteFilter);
  const oldVoteDirection = (vote?.direction ?? NoVote) as VoteDirections;
  if (oldVoteDirection === newVoteDirection) {
    console.error("The voteDirection must be different");
    response.status = 400;
    return;
  }

  // Update vote
  if (newVoteDirection === NoVote) {
    votes.deleteOne(voteFilter);
  } else {
    votes.updateOne(voteFilter, {
      $set: { direction: newVoteDirection },
    }, { upsert: true });
  }

  // Update submission vote keys
  const voteSortKeys = new VoteSortKeysBuilder({
    oldDownVotes: submission.downVotes,
    oldUpVotes: submission.upVotes,
    oldVoteDirection,
    newVoteDirection,
  });
  submissions.updateOne(
    submissionFilter,
    { $set: voteSortKeys },
  );

  // Publish message
  submissionVotedPublisher.publish({
    submissionId,
    userId: userId,
    direction: newVoteDirection,
  });

  response.body = {};
});

export { router as voteSubmissionRouter };
