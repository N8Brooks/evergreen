import { IndexOptions, VoteDirections } from "../deps.ts";
import { mongoClient } from "./mongo_client.ts";

const db = mongoClient.database("votes");

export interface VoteSchema {
  /** Vote id */
  _id: string;

  /** Updated time */
  updatedAt: Date;

  /** The user voting */
  userName: string;

  /** The comment being voted on */
  commentId: string;

  /** The vote */
  direction: Omit<VoteDirections, VoteDirections.NoVote>;
}

const votes = db.collection<VoteSchema>("votes");

/** Many to many userName-commentId must be unique */
const userNameCommentIdIndex: IndexOptions = {
  key: { userName: 1, commentId: 1 },
  name: "_userNameCommentId",
  unique: true,
};

votes.createIndexes({
  indexes: [userNameCommentIdIndex],
});

export { votes };
