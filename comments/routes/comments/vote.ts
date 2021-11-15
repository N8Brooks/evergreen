import { Bson, Router } from "../../deps.ts";
import { comments } from "../../models/comments.ts";
import { VoteActions } from "../../../common/types/vote_actions.ts";

const router = new Router();

// TODO: Votes should be tracked for proper persistance
// TODO: Should this be using a different route?

router.patch("/api/comments/:commentId/comments", async (context) => {
  const { request, response, params } = context;
  const commentId = params?.commentId as unknown as { $oid: string };

  if (!commentId) {
    console.error("No parent comment");
    response.status = 400;
    return;
  }

  const result = request.body();
  if (result.type !== "json") {
    console.error("That was not json");
    response.status = 400;
    return;
  }

  const filter = { _id: new Bson.ObjectId(commentId) };
  const comment = await comments.findOne(filter);
  if (!comment) {
    console.error("Comment does no exist");
    response.status = 400;
    return;
  }

  const { action } = await result.value;
  switch (action) {
    case VoteActions.DownVote:
      comments.updateOne(
        filter,
        { $set: { downVotes: comment.downVotes + 1 } },
      );
      break;
    case VoteActions.Abstain:
      // May reverse previous vote in the future
      break;
    case VoteActions.UpVote:
      comments.updateOne(
        filter,
        { $set: { upVotes: comment.upVotes + 1 } },
      );
      break;
    default:
      console.error("Invalid vote action");
      response.status = 400;
      return;
  }

  response.body = {};
});

export { router as voteCommentRouter };
