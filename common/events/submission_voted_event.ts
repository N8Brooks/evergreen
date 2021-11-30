import { Subjects } from "./subjects.ts";
import { Event } from "./event.ts";

export interface SubmissionVotedEvent extends Event {
  subject: Subjects.SubmissionVoted;
  message: {
    // The id is assumed to be irrelevant

    /** The time of update UTC ms */
    updatedAt: number;

    /** Submission being voted on */
    submissionId: string;

    /** User doing the voting */
    userId: string;

    /** Relevant topic */
    topicId: string;

    /** Change in votes */
    delta: number;
  };
}
