import { log, nats } from "../deps.ts";

/** Expects NATS_URL to be defined */
const NATS_URL = Deno.env.get("NATS_URL");

if (!NATS_URL) {
  log.critical("NATS_URL must be defined");
  Deno.exit(1);
}

const natsConnection = await nats.connect({ servers: NATS_URL });

log.info("Connected to nats");

export { natsConnection };
