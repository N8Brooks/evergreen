import { log, Subjects, Subscriber, TopicCreatedEvent } from "../deps.ts";
import { topics } from "../models/topics.ts";
import { QUEUE } from "./constants.ts";
import { natsConnection } from "./nats_connection.ts";

class TopicCreatedSubscriber extends Subscriber<TopicCreatedEvent> {
  readonly subject = Subjects.TopicCreated;
  queue = QUEUE;

  onMessage(message: TopicCreatedEvent["message"]): void {
    log.debug(`Received topic created event: ${message.name}`);
    const { id } = message;
    topics.insertOne({ _id: id });
  }
}

const topicCreatedSubscriber = new TopicCreatedSubscriber(natsConnection);

export { topicCreatedSubscriber };
