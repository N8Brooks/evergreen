import { Subjects } from "./subjects.ts";
import { VoteDirections } from "../types/vote_directions.ts";
import { Event } from "./event.ts";

export interface CommentVotedEvent extends Event {
  subject: Subjects.CommentVoted;
  message: {
    // The _id is assumed to be irrelevant

    /** Comment being voted on */
    commentId: string;

    /** User doing the voting */
    userId: string;

    /** Direction of the vote */
    direction: VoteDirections;
  };
}
