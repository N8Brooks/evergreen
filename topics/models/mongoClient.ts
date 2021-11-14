import { MongoClient } from "../deps.ts";

const MONGO_URI = Deno.env.get("MONGO_URI");

if (!MONGO_URI) {
  throw new Error("MONGO_URI must be defined");
}

const mongoClient = new MongoClient();

await mongoClient.connect(MONGO_URI);

export { mongoClient };
