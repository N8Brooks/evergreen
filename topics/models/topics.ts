import { mongoClient } from "./mongo_client.ts";
import { IndexOptions } from "../deps.ts";

const db = mongoClient.database("topics");

export interface TopicSchema {
  /** Topic id */
  _id: string;

  /** Creation date */
  createdAt: Date;

  /** Update date */
  updatedAt?: Date;

  /** Topic name */
  name: string;

  /** User who created the topic */
  userId: string;

  /** Topic description */
  description: string;

  /** Cumulative votes received from comments */
  commentScore: number;

  /** Cumulative votes received from submissions */
  submissionScore: number;
}

const topics = db.collection<TopicSchema>("topics");

/** Topic names must be unique */
const nameIndex: IndexOptions = {
  key: { name: 1 },
  name: "_name",
  unique: true,
};

topics.createIndexes({
  indexes: [nameIndex],
});

export { topics };
