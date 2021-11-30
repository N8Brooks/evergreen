import { mongoClient } from "./mongo_client.ts";

const db = mongoClient.database("users");

export interface UserSchema {
  /** Url unique lowercase name */
  _id: string;

  /** Creation date UTC ms */
  createdAt: number;

  /** Updated date UTC ms */
  updatedAt?: number;

  /** User name */
  name: string;

  /** Cumulative votes received from comments */
  commentScore: number;

  /** Cumulative votes received from submissions */
  submissionScore: number;
}

const users = db.collection<UserSchema>("users");

export { users };
