import { Bson, httpErrors, RouterContext } from "../../deps.ts";
import { comments } from "../../models/comments.ts";

const listCommentsForComment = async (
  context: RouterContext<"/api/comments/:commentId/comments">,
) => {
  // Comment exists or throw 404
  const { commentId } = context.params;
  const comment = await comments.findOne({ _id: new Bson.ObjectId(commentId) });
  if (!comment) {
    throw new httpErrors.NotFound("Comment does not exist");
  }

  // TODO: truncate results

  // Return 200 with comments
  context.response.body = await comments
    .find({ parentId: commentId })
    .toArray();
};

export { listCommentsForComment };
