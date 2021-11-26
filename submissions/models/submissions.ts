import { Languages } from "../deps.ts";
import { mongoClient } from "./mongo_client.ts";

const db = mongoClient.database("submissions");

export interface SubmissionSchema {
  /** Submission id */
  _id: string;

  /** Creation time */
  createdAt: Date;

  /** Update time */
  updatedAt?: Date;

  /** Iso 639-1 code */
  language: Languages;

  /** Reference to topic name */
  topicName: string;

  /** Author */
  userName: string;

  /** Given title */
  name: string;

  /** Associated url */
  url?: string;

  /** Count of comments */
  commentCount: number; // TODO: events for this

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
