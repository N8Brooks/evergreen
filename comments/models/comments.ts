import { mongoClient } from "./mongoClient.ts";

const db = mongoClient.database("comments");

export interface CommentSchema {
  _id: { $oid: string };

  /** Positive votes */
  upVotes: number;

  /** Negative votes */
  downVotes: number;

  /** Replies to this comment */
  commentIds: string[];

  /** The option comment this is replying to */
  parentId?: string;

  /** The submission this is in */
  submissionId: string;

  /** Comment text */
  body: string;
}

export const comments = db.collection<CommentSchema>("comments");
