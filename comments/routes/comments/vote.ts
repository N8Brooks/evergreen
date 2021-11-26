import { Router, VoteDirections } from "../../deps.ts";
import { comments } from "../../models/comments.ts";

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

  const filter = { _id: commentId };
  const comment = await comments.findOne(filter);
  if (!comment) {
    console.error("Comment does not exist");
    response.status = 404;
    return;
  }

  const { direction } = await result.value;
  switch (direction) {
    case VoteDirections.DownVote:
      comments.updateOne(
        filter,
        { $set: { downVotes: comment.downVotes + 1 } },
      );
      break;
    case VoteDirections.NoVote:
      // May reverse previous vote in the future
      break;
    case VoteDirections.UpVote:
      comments.updateOne(
        filter,
        { $set: { upVotes: comment.upVotes + 1 } },
      );
      break;
    default:
      console.error("Invalid vote direction");
      response.status = 400;
      return;
  }

  response.body = {};
});

export { router as voteCommentRouter };
