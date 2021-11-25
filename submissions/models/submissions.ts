import { mongoClient } from "./mongo_client.ts";

const db = mongoClient.database("submissions");

export interface SubmissionSchema {
  _id: { $oid: string };

  /** Reference to topic */
  topicId: string;

  /** Author */
  userId: string;

  /** Given title */
  title: string;

  /** Associated url */
  url?: string;

  /** Total up votes */
  upVotes: number;

  /** Total down votes */
  downVotes: number;

  /** Controversy sort */
  controversy: number;

  /** Confidence sort */
  confidence: number;

  /** Difference of votes */
  score: number;
}

export const submissions = db.collection<SubmissionSchema>("submissions");
