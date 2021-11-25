import { mongoClient } from "./mongo_client.ts";

const db = mongoClient.database("topics");

export interface TopicSchema {
  _id: { $oid: string };

  /** Topic name */
  name: string;

  /** User who created the topic */
  userId: string;

  /** Topic description */
  description: string;

  /** Total up votes within topic */
  upVotes: number;

  /** Total down votes within topic */
  downVotes: number;
}

export const topics = db.collection<TopicSchema>("topics");
