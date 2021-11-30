import {
  Bson,
  log,
  Router,
  VOTE_DIRECTIONS,
  VoteDirections,
  VoteSortKeysBuilder,
} from "../../deps.ts";
import { commentVotedPublisher } from "../../events/comment_voted_publisher.ts";
import { comments } from "../../models/comments.ts";
import { votes } from "../../models/votes.ts";

const { NoVote } = VoteDirections;

const router = new Router();

router.patch("/api/comments/:commentId", async (context) => {
  const { request, response, params } = context;
  const result = request.body();
  if (result.type !== "json") {
    log.warning("That was not json");
    response.status = 400;
    return;
  }

  const { commentId } = params;
  if (!commentId) {
    log.warning("No comment id");
    response.status = 400;
    return;
  }

  const commentFilter = { _id: new Bson.ObjectId(commentId) };
  const comment = await comments.findOne(commentFilter);
  if (!comment) {
    log.warning("Comment does not exist");
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
  const userId = userName.toLowerCase();

  const voteFilter = { userName, commentId };
  const vote = await votes.findOne(voteFilter);
  const oldVoteDirection = (vote?.direction ?? NoVote) as VoteDirections;
  if (oldVoteDirection === newVoteDirection) {
    log.warning("The voteDirection must be different");
    response.status = 400;
    return;
  }

  // Update vote
  const updatedAt = Date.now();
  if (newVoteDirection === NoVote) {
    votes.deleteOne(voteFilter);
  } else {
    votes.updateOne(voteFilter, {
      $set: { updatedAt, userName, commentId, direction: newVoteDirection },
    }, { upsert: true });
  }

  // Update submission vote keys
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

  // Publish message
  log.debug(
    `User ${userName} voted ${newVoteDirection} on comment ${commentId}`,
  );
  const { delta } = voteSortKeysBuilder;
  const { topicName } = comment;
  const topicId = topicName.toLowerCase();
  commentVotedPublisher.publish({
    updatedAt,
    commentId,
    userId,
    topicId,
    delta,
  });

  response.body = {};
});

export { router as voteCommentRouter };
