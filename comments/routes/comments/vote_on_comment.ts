import { enums } from "https://raw.githubusercontent.com/N8Brooks/deno_superstruct/main/mod.ts";
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
} from "../../deps.ts";
import { commentVotedPublisher } from "../../events/comment_voted_publisher.ts";
import { comments } from "../../models/comments.ts";
import { votes } from "../../models/votes.ts";

const { object } = superstruct;

const { NoVote } = VoteDirections;

const VoteCommentData = object({
  direction: enums(VOTE_DIRECTIONS),
});

const voteOnComment = async (
  context: RouterContext<"/api/comments/:commentId/comments">,
) => {
  // Get user name or throw 401
  const userName = await context.cookies.get(COOKIE_USER_NAME);
  if (!userName) {
    throw new httpErrors.Unauthorized("Sign in first");
  }
  const userId = userName.toLowerCase();

  // Get data or throw 400
  const result = context.request.body();
  const data = await result.value;
  superstruct.assert(data, VoteCommentData);
  const { direction: newVoteDirection } = data;

  // Find comment or throw 404
  const { commentId } = context.params;
  const commentFilter = { _id: new Bson.ObjectId(commentId) };
  const comment = await comments.findOne(commentFilter);
  if (!comment) {
    throw new httpErrors.NotFound("Comment does not exist");
  }
  const { topicName } = comment;

  // Find previous vote and throw 400 if it hasn't changed
  const voteFilter = { userId, commentId };
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
      $set: { updatedAt, userId, commentId, direction: newVoteDirection },
    }, { upsert: true });
  }

  // Update submission record with vote keys
  const voteSortKeysBuilder = new VoteSortKeysBuilder({
    oldDownVotes: comment.downVotes,
    oldUpVotes: comment.upVotes,
    oldVoteDirection,
    newVoteDirection,
  });
  comments.updateOne(
    commentFilter,
    { $set: voteSortKeysBuilder.build() },
  );

  // Debug
  log.debug(
    `User ${userName} voted ${newVoteDirection} on comment ${commentId}`,
  );

  // Publish message
  const { delta } = voteSortKeysBuilder;
  const topicId = topicName.toLowerCase();
  commentVotedPublisher.publish({
    updatedAt,
    commentId,
    userId,
    topicId,
    delta,
  });

  // Respond as patch
  context.response.status = 204;
};

export { voteOnComment };
