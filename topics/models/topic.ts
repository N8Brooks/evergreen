import { mongoClient } from "./mongoClient.ts";

const db = mongoClient.database("topics");

export interface TopicSchema {
  _id: { $oid: string };
  name: string;
  // description: string;
  // userId: string;
  // posts: idk;
  upVotes: number;
  downVotes: number;
}

export const topics = db.collection<TopicSchema>("topics");
