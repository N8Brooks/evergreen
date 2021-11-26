import { mongoClient } from "./mongo_client.ts";

const db = mongoClient.database("submissions");

export interface SubmissionSchema {
  /** Submission id */
  _id: string;

  /** Reference to topic */
  topicName: string;
}

export const submissions = db.collection<SubmissionSchema>("submissions");
