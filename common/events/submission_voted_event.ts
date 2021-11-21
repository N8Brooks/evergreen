import { Subjects } from "./subjects.ts";
import { VoteDirections } from "../types/vote_directions.ts";
import { PubSubEvent } from "./pub_sub_event.ts";

export interface SubmissionVotedEvent extends PubSubEvent {
  subject: Subjects.SubmissionVoted;
  message: {
    id: string;
    direction: VoteDirections;
  };
}
