import {
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
    console.error("That was not json");
    response.status = 400;
    return;
  }

  const { commentId } = params;
  if (!commentId) {
    console.error("No comment id");
    response.status = 400;
    return;
  }

  const commentFilter = { _id: commentId };
  const comment = await comments.findOne(commentFilter);
  if (!comment) {
    console.error("Comment does not exist");
    response.status = 400;
    return;
  }

  const { direction: newVoteDirection, userName } = await result.value;

  if (!VOTE_DIRECTIONS.includes(newVoteDirection)) {
    console.error("Invalid vote direction");
    response.status = 400;
    return;
  }

  if (!userName) {
    console.error("Invalid userName");
    response.status = 400;
    return;
  }

  const voteFilter = { commentId, userName };
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
  const { upVoteDelta, downVoteDelta } = voteSortKeysBuilder;
  const { topicName } = comment;
  commentVotedPublisher.publish({
    commentId,
    userName,
    topicName,
    upVoteDelta,
    downVoteDelta,
  });

  response.body = {};
});

export { router as voteCommentRouter };
