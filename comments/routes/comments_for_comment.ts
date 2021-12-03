import {
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
import { commentCreatedPublisher } from "../events/comment_created_publisher.ts";
import { commentVotedPublisher } from "../events/comment_voted_publisher.ts";
import { comments, CommentSchema } from "../models/comments.ts";
import { votes } from "../models/votes.ts";
import { CreateCommentData } from "./create_comment_data.ts";

const { NoVote } = VoteDirections;

interface CommentsForCommentState extends RequireAuthState {
  comment: CommentSchema;
}

const VoteCommentData = superstruct.object({
  direction: superstruct.enums(VOTE_DIRECTIONS),
});

/** /api/comments/:commentId/comments */
const router = new Router<CommentsForCommentState>()
  .use(async (context, next) => {
    // Get comment from database referenced
    const { commentId } = context.params;
    const commentFilter = { _id: commentId };
    const comment = await comments.findOne(commentFilter);
    if (!comment) {
      throw new httpErrors.NotFound("Comment does not exist");
    }
    context.state.comment = comment;
    await next();
  })
  .get("/", async (context) => {
    // List children of comment referenced

    // TODO: truncate results
    const parentId = context.params.commentId!;
    context.response.body = await comments
      .find({ parentId })
      .toArray();
  })
  .use(requireAuth)
  .post("/", async (context) => {
    // Create another child comment for referenced comment

    // Validate body or throw 400
    const result = context.request.body();
    const data = await result.value;
    superstruct.assert(data, CreateCommentData);
    const { text } = data;

    // Gather extraneous data
    const createdAt = Date.now();
    const [language] = context.request.acceptsLanguages() ?? [];
    const { comment, userName, userId } = context.state;
    const { topicId, topicName, submissionId } = comment;
    const parentId = context.params.commentId!;

    // Create record
    const _id = await comments.insertOne({
      createdAt,
      language,
      topicId,
      topicName,
      userId,
      userName,
      parentId,
      submissionId,
      text,
      ...VoteSortKeysBuilder.default,
    });
    const id = _id.toString();

    // Debug
    log.debug(`User ${userName} commented ${id} on comment ${parentId}`);

    // Publish event
    commentCreatedPublisher.publish({
      id,
      createdAt,
      language,
      topicName,
      topicId,
      userName,
      userId,
      parentId,
      submissionId,
      text,
    });

    // Respond
    context.response.body = { id };
    context.response.status = 201;
  })
  .patch("/", async (context) => {
    // Vote on referenced comment

    // Validate data or throw 400
    const result = context.request.body();
    const data = await result.value;
    superstruct.assert(data, VoteCommentData);
    const { direction: newVoteDirection } = data;

    // Find previous vote and throw 400 if it hasn't changed
    const { userId } = context.state;
    const commentId = context.params.commentId!;
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
    const { comment } = context.state;
    const voteSortKeysBuilder = new VoteSortKeysBuilder({
      oldDownVotes: comment.downVotes,
      oldUpVotes: comment.upVotes,
      oldVoteDirection,
      newVoteDirection,
    });
    comments.updateOne(
      { _id: commentId },
      { $set: voteSortKeysBuilder.build() },
    );

    // Debug
    const { userName } = context.state;
    log.debug(
      `User ${userName} voted ${newVoteDirection} on comment ${commentId}`,
    );

    // Publish message
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

    // Respond as patch
    context.response.status = 204;
  });

export { router as commentsForComment };
