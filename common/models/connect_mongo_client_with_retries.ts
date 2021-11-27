import { log, MongoClient } from "../deps.ts";

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
      log.info(
        `MongoClient connection attempt ${connectionAttempts}/${MAXIMUM_CONNECTION_ATTEMPTS}`,
      );
      await mongoClient.connect(mongoUri);
      isConnected = true;
    } catch (e) {
      if (connectionAttempts < MAXIMUM_CONNECTION_ATTEMPTS) {
        log.error(e);
      } else {
        log.critical(e);
      }
      await new Promise((res) => setTimeout(res, CONNECTION_ATTEMPT_DELAY));
    }
  } while (!isConnected);
}
