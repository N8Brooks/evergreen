import { mongoClient } from "../deps.ts";

const db = mongoClient.database("topics");

export interface TopicSchema {
  _id: { $oid: string };
  name: string;
  userId: string;
  // description: string;
  // submissions;
  upVotes: number;
  downVotes: number;
}

export const topics = db.collection<TopicSchema>("topics");
