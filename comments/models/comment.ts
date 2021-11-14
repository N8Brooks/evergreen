import { mongoClient } from "./mongoClient.ts";

const db = mongoClient.database("comments");

export interface CommentSchema {
  _id: { $oid: string };
  upVotes: number;
  downVotes: number;
  // topicId: string;
  // userId: string;
  // comments: idk;
  parentId?: string;
  postId: string;
  body: string;
}

export const comments = db.collection<CommentSchema>("comments");
