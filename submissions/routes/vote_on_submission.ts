import {
  Bson,
  COOKIE_USER_NAME,
  httpErrors,
  log,
  RouterContext,
  superstruct,
  VOTE_DIRECTIONS,
  VoteDirections,
  VoteSortKeysBuilder,
} from "../deps.ts";
import { submissionVotedPublisher } from "../events/submission_voted_publisher.ts";
import { submissions } from "../models/submissions.ts";
import { votes } from "../models/votes.ts";

const { NoVote } = VoteDirections;

const { object, enums } = superstruct;

const VoteSubmissionRequest = object({
  direction: enums(VOTE_DIRECTIONS),
});

// TODO: maybe one day $lookup will be possible which will prevent two mongo requests.

const voteOnSubmission = async (
  context: RouterContext<"/api/submissions/:submissionId">,
) => {
  const userName = await context.cookies.get(COOKIE_USER_NAME);
  if (!userName) {
    throw new httpErrors.Unauthorized("Sign in first");
  }
  const userId = userName.toLowerCase();

  const result = context.request.body();
  const data = await result.value;
  superstruct.assert(data, VoteSubmissionRequest);
  const newVoteDirection = data.direction;

  const { submissionId } = context.params;
  const submissionFilter = { _id: new Bson.ObjectId(submissionId) };
  const submission = await submissions.findOne(submissionFilter);
  if (!submission) {
    throw new httpErrors.NotFound("Submission does not exist");
  }

  const voteFilter = { userId, submissionId };
  const vote = await votes.findOne(voteFilter);
  const oldVoteDirection = (vote?.direction ?? NoVote) as VoteDirections;
  if (oldVoteDirection === newVoteDirection) {
    throw new httpErrors.BadRequest("Vote direction must be different");
  }

  // Update vote
  const updatedAt = Date.now();
  if (newVoteDirection === NoVote) {
    if (vote) {
      votes.deleteOne(voteFilter);
    }
  } else {
    votes.updateOne(voteFilter, {
      $set: { updatedAt, userId, submissionId, direction: newVoteDirection },
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
  const { delta } = voteSortKeysBuilder;
  const { topicName } = submission;
  submissionVotedPublisher.publish({
    updatedAt,
    submissionId,
    userId: userName,
    topicId: topicName,
    delta,
  });

  context.response.status = 204;
};

export { voteOnSubmission };
