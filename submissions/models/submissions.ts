import { mongoClient } from "../deps.ts";

const db = mongoClient.database("submissions");

export interface SubmissionSchema {
  _id: { $oid: string };
  upVotes: number;
  downVotes: number;
  topicId: string;
  userId: string;
  // comments;
  title: string;
  url?: string;
}

export const submissions = db.collection<SubmissionSchema>("submissions");
