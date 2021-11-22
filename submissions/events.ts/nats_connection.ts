import { nats } from "../deps.ts";

/** Expects NATS_URL to be defined */
const NATS_URL = Deno.env.get("NATS_URL");

if (!NATS_URL) {
  throw new Error("NATS_URL must be defined");
}

const natsConnection = await nats.connect({ servers: NATS_URL });

console.log("Connected to nats");

export { natsConnection };
