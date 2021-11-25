import { IndexOptions } from "../deps.ts";
import { mongoClient } from "./mongo_client.ts";

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

const users = db.collection<UserSchema>("users");

/** User names must be unique */
const nameIndex: IndexOptions = {
  key: { name: 1 },
  name: "_name",
  unique: true,
};

users.createIndexes({
  indexes: [nameIndex],
});

export { users };
