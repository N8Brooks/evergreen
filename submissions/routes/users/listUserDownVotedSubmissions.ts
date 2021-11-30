import {
  Bson,
  COOKIE_USER_NAME,
  httpErrors,
  RouterContext,
  VoteDirections,
} from "../../deps.ts";
import { submissions } from "../../models/submissions.ts";
import { votes } from "../../models/votes.ts";

const { DownVote } = VoteDirections;

const listUserDownVotedSubmissions = async (
  context: RouterContext<"/api/users/:_userName/down_voted">,
) => {
  // Possibly not the exact capitalization
  const { _userName } = context.params;
  const userId = _userName.toLowerCase();
  const userName = await context.cookies.get(COOKIE_USER_NAME);
  if (!userName) {
    throw new httpErrors.Unauthorized("Sign in first");
  } else if (userId !== userName.toLowerCase()) {
    throw new httpErrors.Unauthorized("Incorrect account");
  }

  // TODO: truncate results

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
};

export { listUserDownVotedSubmissions };
