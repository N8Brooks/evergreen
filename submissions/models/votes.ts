import { IndexOptions, VoteDirections } from "../deps.ts";
import { mongoClient } from "./mongo_client.ts";

const { UpVote, DownVote } = VoteDirections;

const db = mongoClient.database("votes");

export interface VoteSchema {
  /** Vote id */
  _id: string;

  /** Updated time UTC ms */
  updatedAt: number;

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

/** Querying by up votes */
const upVotedIndex: IndexOptions = {
  key: { userId: 1, updatedAt: -1 },
  name: "_upVoted",
  partialFilterExpression: { direction: UpVote },
};

/** Querying by down votes */
const downVotedIndex: IndexOptions = {
  key: { userId: 1, updatedAt: -1 },
  name: "_downVoted",
  partialFilterExpression: { direction: DownVote },
};

votes.createIndexes({
  indexes: [userIdSubmissionIdIndex, upVotedIndex, downVotedIndex],
});

export { votes };
