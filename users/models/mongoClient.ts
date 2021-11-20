import { MongoClient } from "../deps.ts";

const MONGO_URI = Deno.env.get("MONGO_URI");

if (!MONGO_URI) {
  throw new Error("MONGO_URI must be defined");
}

const mongoClient = new MongoClient();

await connectMongoClientWithRetries(mongoClient, MONGO_URI);

console.log("Successfully connected to mongodb");

export { mongoClient };

/** Attempts to connect to mongodb up to 3 times */
async function connectMongoClientWithRetries(
  mongoClient: MongoClient,
  mongoUri: string,
) {
  let isConnected = false;
  let connectionAttempts = 0;
  do {
    try {
      connectionAttempts++;
      await mongoClient.connect(mongoUri);
      isConnected = true;
    } catch (e) {
      if (connectionAttempts === 3) {
        throw e;
      }
      console.error(`Failed mongodb connection attempt #${connectionAttempts}`);
      await new Promise((res) => setTimeout(res, 1000));
    }
  } while (!isConnected);
}
