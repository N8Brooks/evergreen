import { IndexOptions } from "../deps.ts";
import { mongoClient } from "./mongo_client.ts";

const db = mongoClient.database("topics");

export interface TopicSchema {
  /** Topic id */
  _id: string;

  /** Topic name */
  name: string;

  /** User who created the topic */
  userName: string;

  /** Topic description */
  description: string;
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
