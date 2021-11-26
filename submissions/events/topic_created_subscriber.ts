import { Subjects, Subscriber, TopicCreatedEvent } from "../deps.ts";
import { topics } from "../models/topics.ts";
import { QUEUE } from "./constants.ts";
import { natsConnection } from "./nats_connection.ts";

class TopicCreatedSubscriber extends Subscriber<TopicCreatedEvent> {
  readonly subject = Subjects.TopicCreated;
  queue = QUEUE;

  onMessage(message: TopicCreatedEvent["message"]): void {
    console.log("New topic", message.name);
    const {
      id,
      description,
      name,
      userId,
    } = message;

    topics.insertOne({
      _id: id,
      description,
      name,
      userId,
    });
  }
}

const topicCreatedSubscriber = new TopicCreatedSubscriber(natsConnection);

export { topicCreatedSubscriber };
