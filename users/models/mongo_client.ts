import { connectMongoClientWithRetries, log, MongoClient } from "../deps.ts";

/** Expects MONGO_URI to be defined */
const MONGO_URI = Deno.env.get("MONGO_URI");

if (!MONGO_URI) {
  log.critical("MONGO_URI must be defined");
  Deno.exit(1);
}

const mongoClient = new MongoClient();

await connectMongoClientWithRetries(mongoClient, MONGO_URI);

log.info("Successfully connected to mongodb");

export { mongoClient };
