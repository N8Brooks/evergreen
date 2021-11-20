import { mongoClient } from "./mongoClient.ts";

const db = mongoClient.database("users");

export interface UserSchema {
  _id: { $oid: string };
  upVotes: number;
  downVotes: number;
  // topics: idk
  // submissions: idk
  // comments: idk;
  name: string;
}

export const users = db.collection<UserSchema>("users");
