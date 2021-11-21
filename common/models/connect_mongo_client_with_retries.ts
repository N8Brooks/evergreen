import { MongoClient } from "../deps.ts";

/** Throws error after failing to connect this many times */
const MAXIMUM_CONNECTION_ATTEMPTS = 10;

/** Time to wait before attempting to connect again in ms */
const CONNECTION_ATTEMPT_DELAY = 1000;

/** Attempts to connect `mongoClient` to `mongoUri` a limited number of times */
export async function connectMongoClientWithRetries(
  mongoClient: MongoClient,
  mongoUri: string,
): Promise<void> {
  let isConnected = false;
  let connectionAttempts = 0;
  do {
    try {
      connectionAttempts++;
      await mongoClient.connect(mongoUri);
      isConnected = true;
    } catch (e) {
      console.error(`Failed mongodb connection attempt #${connectionAttempts}`);
      if (connectionAttempts < MAXIMUM_CONNECTION_ATTEMPTS) {
        console.error(e);
      } else {
        throw e;
      }
      await new Promise((res) => setTimeout(res, CONNECTION_ATTEMPT_DELAY));
    }
  } while (!isConnected);
}
