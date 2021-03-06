import { VoteSortKeys } from "../deps.ts";
import { mongoClient } from "./mongo_client.ts";

const db = mongoClient.database("comments");

export interface CommentSchema extends VoteSortKeys {
  /** Comment id */
  _id: string;

  /** Creation time UTC ms */
  createdAt: number;

  /** Update time UTC ms */
  updatedAt?: number;

  /** Iso 639-1 code */
  language?: string;

  /** The topic id this is associated with */
  topicId: string;

  /** The topic this is associated with */
  topicName: string;

  /** Comment author id */
  userId: string;

  /** Comment author */
  userName: string;

  /** The optional comment this is replying to */
  parentId?: string;

  /** The submission this is in */
  submissionId: string;

  /** Comment body */
  text: string;
}

// TODO: comment indexes

export const comments = db.collection<CommentSchema>("comments");
