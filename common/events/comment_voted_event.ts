import { Subjects } from "./subjects.ts";
import { Event } from "./event.ts";

export interface CommentVotedEvent extends Event {
  subject: Subjects.CommentVoted;
  message: {
    // The _id is assumed to be irrelevant

    /** The time of update UTC ms */
    updatedAt: number;

    /** Comment being voted on */
    commentId: string;

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
