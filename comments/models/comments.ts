import { mongoClient } from "./mongo_client.ts";

const db = mongoClient.database("comments");

export interface CommentSchema {
  /** Comment id */
  _id: string;

  /** Creation time UTC ms */
  createdAt: number;

  /** Update time UTC ms */
  updatedAt?: number;

  /** Iso 639-1 code */
  language?: string;

  /** The topic this is associated with */
  topicName: string;

  /** Comment author */
  userName: string;

  /** The optional comment this is replying to */
  parentId?: string;

  /** The submission this is in */
  submissionId: string;

  /** Comment body */
  text: string;

  /** Positive votes */
  upVotes: number;

  /** Negative votes */
  downVotes: number;

  /** Confidence sort */
  confidence: number;

  /** Controversy sort */
  controversy: number;

  /** Difference of votes */
  score: number;
}

// TODO: comment indexes

export const comments = db.collection<CommentSchema>("comments");
