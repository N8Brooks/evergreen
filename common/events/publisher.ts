import { nats } from "../deps.ts";
import { PubSubEvent } from "./pub_sub_event.ts";

export abstract class Publisher<T extends PubSubEvent> {
  abstract readonly subject: T["subject"];
  protected natsConnection: nats.NatsConnection;
  private messageCodec: nats.Codec<T["message"]>;

  constructor(natsConnection: nats.NatsConnection) {
    this.natsConnection = natsConnection;
    this.messageCodec = nats.JSONCodec<T["message"]>();
  }

  publish(message: T["message"]): void {
    const data = this.messageCodec.encode(message);
    this.natsConnection.publish(this.subject, data);
  }
}
