import {
  Bson,
  httpErrors,
  log,
  requireAuth,
  RequireAuthState,
  Router,
  superstruct,
  VOTE_DIRECTIONS,
  VoteDirections,
  VoteSortKeysBuilder,
} from "../deps.ts";
import { submissionVotedPublisher } from "../events/submission_voted_publisher.ts";
import { submissions } from "../models/submissions.ts";
import { votes } from "../models/votes.ts";

const { DownVote, NoVote, UpVote } = VoteDirections;

const { object, enums } = superstruct;

const VoteSubmissionData = object({
  direction: enums(VOTE_DIRECTIONS),
});

const router = new Router<RequireAuthState>()
  .get("/", async (context) => {
    // all topics

    // TODO: truncate results
    context.response.body = await submissions.find().toArray();
  })
  .use(requireAuth)
  .patch("/:submissionId", async (context) => {
    // vote on submission

    // Assert data or throw 400
    const result = context.request.body();
    const data = await result.value;
    superstruct.assert(data, VoteSubmissionData);
    const newVoteDirection = data.direction;

    // Find referenced submission or throw 404
    const { submissionId } = context.params;
    const submissionFilter = { _id: new Bson.ObjectId(submissionId) };
    const submission = await submissions.findOne(submissionFilter);
    if (!submission) {
      throw new httpErrors.NotFound("Submission does not exist");
    }

    // User has possibly voted before
    const { userId } = context.state;
    const voteFilter = { userId, submissionId };
    const vote = await votes.findOne(voteFilter);
    const oldVoteDirection = (vote?.direction ?? NoVote) as VoteDirections;
    if (oldVoteDirection === newVoteDirection) {
      throw new httpErrors.BadRequest("Vote direction must be different");
    }

    // Update vote record
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

    // Debug
    const { userName } = context.state;
    log.debug(
      `User ${userName} voted ${newVoteDirection} on submission ${submissionId}`,
    );

    // Publish message
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
  })
  .get("/up_voted", async (context) => {
    // Submissions the user has up voted
    const { userId } = context.state;
    const upVoteFilter = { userId, direction: UpVote };
    const upVotes = await votes
      .find(upVoteFilter)
      .sort({ updatedAt: -1 })
      .toArray();
    const upVotedSubmissionIds = upVotes.map((upVote) =>
      new Bson.ObjectId(upVote.submissionId) as unknown as string
    );
    context.response.body = await submissions
      .find({ _id: { $in: upVotedSubmissionIds } })
      .toArray();
  })
  .get("/down_voted", async (context) => {
    // Submissions the user has down voted
    const { userId } = context.state;
    const downVoteFilter = { userId, direction: DownVote };
    const downVotes = await votes
      .find(downVoteFilter)
      .sort({ updatedAt: -1 })
      .toArray();
    const downVotedSubmissionIds = downVotes.map((downVote) =>
      new Bson.ObjectId(downVote.submissionId) as unknown as string
    );
    context.response.body = await submissions
      .find({ _id: { $in: downVotedSubmissionIds } })
      .toArray();
  });

export { router as submissionsHandler };
