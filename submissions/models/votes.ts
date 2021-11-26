import { IndexOptions, VoteDirections } from "../deps.ts";
import { mongoClient } from "./mongo_client.ts";

const db = mongoClient.database("votes");

export interface VoteSchema {
  /** Vote id */
  _id: string;

  /** The user voting */
  userId: string;

  /** The submission being voted on */
  submissionId: string;

  /** The vote */
  direction: Omit<VoteDirections, VoteDirections.NoVote>;
}

const votes = db.collection<VoteSchema>("votes");

/** Many to many userId-submissionId must be unique */
const userIdSubmissionIdIndex: IndexOptions = {
  key: { userId: 1, submissionId: 1 },
  name: "_userIdSubmissionId",
  unique: true,
};

votes.createIndexes({
  indexes: [userIdSubmissionIdIndex],
});

export { votes };
