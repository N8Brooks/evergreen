import { Bson, Router, VoteDirections } from "../../deps.ts";
import { submissions } from "../../models/submissions.ts";
import { votes } from "../../models/votes.ts";

const { DownVote } = VoteDirections;

const router = new Router();

router.get(
  "/api/users/:userName/down_voted",
  async ({ params, response }) => {
    const { userName } = params;

    if (!userName) {
      console.error("No user name");
      response.status = 400;
      return;
    }

    // TODO: check if user exists here

    // TODO: truncate results

    const downVoteFilter = { userName, direction: DownVote };
    const downVotes = await votes.find(downVoteFilter).toArray();
    const downVotedSubmissionIds = downVotes.map((downVote) =>
      new Bson.ObjectId(downVote.submissionId) as unknown as string
    );
    response.body = await submissions
      .find({ _id: { $in: downVotedSubmissionIds } })
      .toArray();
  },
);

export { router as listSubmissionsByDownVotedRouter };
