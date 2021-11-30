import { mongoClient } from "./mongo_client.ts";
const db = mongoClient.database("topics");

export interface TopicSchema {
  /** Url unique lowercase name */
  _id: string;

  /** Creation date UTC ms */
  createdAt: number;

  /** Update date UTC ms */
  updatedAt?: number;

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

export { topics };
