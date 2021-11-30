import { mongoClient } from "./mongo_client.ts";

const db = mongoClient.database("topics");

export interface TopicSchema {
  /** Url unique lowercase topic name */
  _id: string;

  /** Case sensitive topic name */
  name: string;
}

const topics = db.collection<TopicSchema>("topics");

export { topics };
