import { Subjects } from "./subjects.ts";
import { Event } from "./event.ts";

export interface SubmissionVotedEvent extends Event {
  subject: Subjects.SubmissionVoted;
  message: {
    // The _id is assumed to be irrelevant

    /** Submission being voted on */
    submissionId: string;

    /** User doing the voting */
    userId: string;

    /** Relevant topic */
    topicId: string;

    /** Change in down votes */
    downVoteDelta: number;

    /** Change in up votes */
    upVoteDelta: number;
  };
}
