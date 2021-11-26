import { IndexOptions } from "../deps.ts";
import { mongoClient } from "./mongo_client.ts";

const db = mongoClient.database("users");

export interface UserSchema {
  /** User id */
  _id: string;

  /** Creation date */
  createdAt: Date;

  /** Updated date */
  updatedAt?: Date;

  /** User name */
  name: string;

  /** Total up votes for user */
  upVotes: number;

  /** Total down votes for user */
  downVotes: number;
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
