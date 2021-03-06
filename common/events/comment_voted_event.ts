import { Subjects } from "./subjects.ts";
import { Event } from "./event.ts";

export interface CommentVotedEvent extends Event {
  subject: Subjects.CommentVoted;
  message: {
    // The id is assumed to be irrelevant

    /** The time of update UTC ms */
    updatedAt: number;

    /** Comment being voted on */
    commentId: string;

    /** User doing the voting */
    userId: string;

    /** Relevant topic */
    topicId: string;

    /** Change in votes */
    delta: number;
  };
}
