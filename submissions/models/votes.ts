import { IndexOptions, VoteDirections } from "../deps.ts";
import { mongoClient } from "./mongo_client.ts";

const { UpVote, DownVote } = VoteDirections;

const db = mongoClient.database("votes");

export interface VoteSchema {
  /** Vote id */
  _id: string;

  /** Updated time */
  updatedAt: Date;

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

/** Support querying by up votes */
const upVotedIndex: IndexOptions = {
  key: { userName: 1, updatedAt: -1 },
  name: "_upVoted",
  partialFilterExpression: { direction: UpVote },
};

/** Support querying by down votes */
const downVotedIndex: IndexOptions = {
  key: { userName: 1, updatedAt: -1 },
  name: "_downVoted",
  partialFilterExpression: { direction: DownVote },
};

votes.createIndexes({
  indexes: [userNameSubmissionIdIndex, upVotedIndex, downVotedIndex],
});

export { votes };
