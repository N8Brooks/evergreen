import { Bson, Router, VoteActions } from "../../deps.ts";
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
  const filter = { _id: new Bson.ObjectId(commentId) };
  const comment = await comments.findOne(filter);
  if (!comment) {
    console.error("Comment does not exist");
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
