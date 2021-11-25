import { natsConnection } from "./nats_connection.ts";
import { Publisher, Subjects, TopicCreatedEvent } from "../deps.ts";

class TopicCreatedPublisher extends Publisher<TopicCreatedEvent> {
  readonly subject = Subjects.TopicCreated;
}

const topicCreatedPublisher = new TopicCreatedPublisher(
  natsConnection,
);

export { topicCreatedPublisher };
