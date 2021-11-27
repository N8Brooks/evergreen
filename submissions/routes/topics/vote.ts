import {
  Bson,
  log,
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
    log.warning("That was not json");
    response.status = 400;
    return;
  }

  const { submissionId } = params;
  if (!submissionId) {
    log.warning("Invalid submissionId");
    response.status = 400;
    return;
  }

  const submissionFilter = { _id: new Bson.ObjectId(submissionId) };
  const submission = await submissions.findOne(submissionFilter);
  if (!submission) {
    log.warning("Submission does not exist");
    response.status = 400;
    return;
  }

  const { direction: newVoteDirection, userName } = await result.value;

  if (!VOTE_DIRECTIONS.includes(newVoteDirection)) {
    log.warning("Invalid vote direction");
    response.status = 400;
    return;
  }

  if (!userName) {
    log.warning("Invalid userName");
    response.status = 400;
    return;
  }

  const voteFilter = { submissionId, userName };
  const vote = await votes.findOne(voteFilter);
  const oldVoteDirection = (vote?.direction ?? NoVote) as VoteDirections;
  if (oldVoteDirection === newVoteDirection) {
    log.warning("The voteDirection must be different");
    response.status = 400;
    return;
  }

  // Update vote
  const updatedAt = new Date();
  if (newVoteDirection === NoVote) {
    votes.deleteOne(voteFilter);
  } else {
    votes.updateOne(voteFilter, {
      $set: { updatedAt, userName, submissionId, direction: newVoteDirection },
    }, { upsert: true });
  }

  // Update submission vote keys
  const voteSortKeysBuilder = new VoteSortKeysBuilder({
    oldDownVotes: submission.downVotes,
    oldUpVotes: submission.upVotes,
    oldVoteDirection,
    newVoteDirection,
  });
  submissions.updateOne(
    submissionFilter,
    { $set: voteSortKeysBuilder.build() },
  );

  // Publish message
  log.debug(
    `User ${userName} voted ${newVoteDirection} on submission ${submissionId}`,
  );
  const { upVoteDelta, downVoteDelta } = voteSortKeysBuilder;
  const { topicName } = submission;
  submissionVotedPublisher.publish({
    updatedAt,
    submissionId,
    userName,
    topicName,
    upVoteDelta,
    downVoteDelta,
  });

  response.body = {};
});

export { router as voteSubmissionRouter };
