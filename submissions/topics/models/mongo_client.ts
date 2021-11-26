import { connectMongoClientWithRetries, MongoClient } from "../deps.ts";

/** Expects MONGO_URI to be defined */
const MONGO_URI = Deno.env.get("MONGO_URI");

if (!MONGO_URI) {
  throw new Error("MONGO_URI must be defined");
}

const mongoClient = new MongoClient();

await connectMongoClientWithRetries(mongoClient, MONGO_URI);

console.log("Successfully connected to mongodb");

export { mongoClient };
