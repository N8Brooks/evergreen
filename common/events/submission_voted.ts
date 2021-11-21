import { VoteDirections } from "../types/vote_directions.ts";

export const SubmissionVotedSubject = "submission:voted";

export interface SubmissionVotedEvent {
  id: string;
  direction: VoteDirections;
}
