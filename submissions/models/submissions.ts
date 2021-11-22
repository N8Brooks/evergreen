import { VoteDirections } from "../deps.ts";
import { mongoClient } from "./mongo_client.ts";

const db = mongoClient.database("submissions");

export interface SubmissionSchema {
  _id: { $oid: string };

  /** Total up votes */
  upVotes: number;

  /** Total down votes */
  downVotes: number;

  // TODO: find a better way to model this relationship
  /** Maps userIds to voteDirections */
  votes: Record<string, Omit<VoteDirections, VoteDirections.NoVote>>;

  /** Reference to topic */
  topicId: string;

  /** Author */
  userId: string;

  /** Given title */
  title: string;

  /** Associated url */
  url?: string;
}

export const submissions = db.collection<SubmissionSchema>("submissions");
