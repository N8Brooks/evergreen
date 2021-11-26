import { IndexOptions, VoteDirections } from "../deps.ts";
import { mongoClient } from "./mongo_client.ts";

const db = mongoClient.database("votes");

export interface VoteSchema {
  /** Vote id */
  _id: string;

  /** The user voting */
  userName: string;

  /** The submission being voted on */
  submissionId: string;

  /** The vote */
  direction: Omit<VoteDirections, VoteDirections.NoVote>;
}

const votes = db.collection<VoteSchema>("votes");

/** Many to many userName-submissionId must be unique */
const userNameSubmissionIdIndex: IndexOptions = {
  key: { userName: 1, submissionId: 1 },
  name: "_userNameSubmissionId",
  unique: true,
};

votes.createIndexes({
  indexes: [userNameSubmissionIdIndex],
});

export { votes };
