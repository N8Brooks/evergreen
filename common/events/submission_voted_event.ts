import { Subjects } from "./subjects.ts";
import { VoteDirections } from "../types/vote_directions.ts";
import { Event } from "./event.ts";

export interface SubmissionVotedEvent extends Event {
  subject: Subjects.SubmissionVoted;
  message: {
    id: string;
    direction: VoteDirections;
  };
}
