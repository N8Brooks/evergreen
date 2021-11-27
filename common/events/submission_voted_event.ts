import { Subjects } from "./subjects.ts";
import { Event } from "./event.ts";

export interface SubmissionVotedEvent extends Event {
  subject: Subjects.SubmissionVoted;
  message: {
    // The _id is assumed to be irrelevant

    /** The time of update */
    updatedAt: Date;

    /** Submission being voted on */
    submissionId: string;

    /** User doing the voting */
    userName: string;

    /** Relevant topic */
    topicName: string;

    /** Change in down votes */
    downVoteDelta: number;

    /** Change in up votes */
    upVoteDelta: number;
  };
}
