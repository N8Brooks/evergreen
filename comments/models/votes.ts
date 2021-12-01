import { IndexOptions, VoteDirections } from "../deps.ts";
import { mongoClient } from "./mongo_client.ts";

const db = mongoClient.database("votes");

export interface VoteSchema {
  /** Vote id */
  _id: string;

  /** Updated time UTC ms */
  updatedAt: number;

  /** The user voting */
  userId: string;

  /** The comment being voted on */
  commentId: string;

  /** The vote */
  direction: Omit<VoteDirections, VoteDirections.NoVote>;
}

const votes = db.collection<VoteSchema>("votes");

/** Many to many userId-commentId must be unique */
const userIdCommentIdIndex: IndexOptions = {
  key: { userId: 1, commentId: 1 },
  name: "_userIdCommentId",
  unique: true,
};

votes.createIndexes({
  indexes: [userIdCommentIdIndex],
});

export { votes };
