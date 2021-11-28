import { Languages } from "../deps.ts";
import { mongoClient } from "./mongo_client.ts";

const db = mongoClient.database("submissions");

export interface SubmissionSchema {
  /** Submission id */
  _id: string;

  /** Creation time UTC ms */
  createdAt: number;

  /** Update time UTC ms */
  updatedAt?: number;

  /** Iso 639-1 code */
  language: Languages;

  /** Reference to topic name */
  topicName: string;

  /** Author */
  userName: string;

  /** Given title */
  title: string;

  /** Associated url */
  url?: string;

  /** Count of comments */
  commentCount: number;

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

// TODO: submission indexes

export const submissions = db.collection<SubmissionSchema>("submissions");
