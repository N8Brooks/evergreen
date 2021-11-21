import { Subjects } from "./subjects.ts";
import { VoteDirections } from "../types/vote_directions.ts";

export interface SubmissionVotedEvent {
  subject: Subjects.SubmissionVoted;
  data: {
    id: string;
    direction: VoteDirections;
  };
}
