import { Bson, Router, VoteDirections } from "../../deps.ts";
import { submissions } from "../../models/submissions.ts";
import { votes } from "../../models/votes.ts";

const { UpVote } = VoteDirections;

const router = new Router();

router.get(
  "/api/users/:userName/up_voted",
  async ({ params, response }) => {
    const { userName } = params;

    if (!userName) {
      console.error("No user name");
      response.status = 400;
      return;
    }

    // TODO: check if user exists here

    // TODO: truncate results

    const upVoteFilter = { userName, direction: UpVote };
    const upVotes = await votes.find(upVoteFilter).toArray();
    const upVotedSubmissionIds = upVotes.map((upVote) =>
      new Bson.ObjectId(upVote.submissionId) as unknown as string
    );
    response.body = await submissions
      .find({ _id: { $in: upVotedSubmissionIds } })
      .toArray();
  },
);

export { router as listSubmissionsByUpVotedRouter };
