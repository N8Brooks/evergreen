import { mongoClient } from "./mongoClient.ts";

const db = mongoClient.database("posts");

export interface PostSchema {
  _id: { $oid: string };
  upVotes: number;
  downVotes: number;
  topicName: string;
  // userId: string;
  // comments: idk;
  title: string;
  url: string;
}

export const posts = db.collection<PostSchema>("posts");
