import {
  Bson,
  COOKIE_USER_NAME,
  httpErrors,
  RouterContext,
  VoteDirections,
} from "../../deps.ts";
import { submissions } from "../../models/submissions.ts";
import { votes } from "../../models/votes.ts";

const { UpVote } = VoteDirections;

const listUserUpVotedSubmissions = async (
  context: RouterContext<"/api/users/:_userName/up_voted">,
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
};

export { listUserUpVotedSubmissions };
