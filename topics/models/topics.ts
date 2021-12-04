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

  /** Lowercase url unique user */
  userId: string;

  /** User who created the topic */
  userName: string;

  /** Topic description */
  description: string;

  /** Cumulative votes received from comments */
  commentScore: number;

  /** Cumulative votes received from submissions */
  submissionScore: number;
}

const topics = db.collection<TopicSchema>("topics");

export { topics };
