import { VoteDirections } from "../deps.ts";
import { mongoClient } from "./mongo_client.ts";

const db = mongoClient.database("votes");

export interface VoteSchema {
  _id: { $oid: string };

  /** The user voting */
  userId: string;

  /** The submission being voted on */
  submissionId: string;

  /** The vote */
  direction: Omit<VoteDirections, VoteDirections.NoVote>;
}

export const votes = db.collection<VoteSchema>("votes");
