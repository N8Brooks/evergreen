import { nats } from "../deps.ts";
import { PubSubEvent } from "./pub_sub_event.ts";

export abstract class Listener<T extends PubSubEvent> {
  abstract readonly subject: T["subject"];
  abstract queue: string;
  abstract onMessage(data: T["message"]): void;
  protected natsConnection: nats.NatsConnection;
  private messageCodec: nats.Codec<T["message"]>;

  constructor(natsConnection: nats.NatsConnection) {
    this.natsConnection = natsConnection;
    this.messageCodec = nats.JSONCodec<T["message"]>();
  }

  async listen() {
    const subscription = this.natsConnection.subscribe(this.subject);
    for await (const { data } of subscription) {
      const message = this.messageCodec.decode(data);
      this.onMessage(message);
    }
  }
}
