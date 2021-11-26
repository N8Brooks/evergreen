import { natsConnection } from "./nats_connection.ts";
import { CommentCreatedEvent, Publisher, Subjects } from "../deps.ts";

class CommentCreatedPublisher extends Publisher<CommentCreatedEvent> {
  readonly subject = Subjects.CommentCreated;
}

const commentCreatedPublisher = new CommentCreatedPublisher(
  natsConnection,
);

export { commentCreatedPublisher };
