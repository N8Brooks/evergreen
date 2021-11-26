import { Subjects } from "./subjects.ts";
import { VoteDirections } from "../types/vote_directions.ts";
import { Event } from "./event.ts";

export interface SubmissionVotedEvent extends Event {
  subject: Subjects.SubmissionVoted;
  message: {
    // The _id is assumed to be irrelevant

    /** Submission being voted on */
    submissionId: string;

    /** User doing the voting */
    userId: string;

    /** Direction of the vote */
    direction: VoteDirections;
  };
}
