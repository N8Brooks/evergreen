import { natsConnection } from "./nats_connection.ts";
import { CommentVotedEvent, Publisher, Subjects } from "../deps.ts";

class CommentVotedPublisher extends Publisher<CommentVotedEvent> {
  readonly subject = Subjects.CommentVoted;
}

const commentVotedPublisher = new CommentVotedPublisher(
  natsConnection,
);

export { commentVotedPublisher };
