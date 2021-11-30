import { CommentVotedEvent, log, Subjects, Subscriber } from "../deps.ts";
import { users } from "../models/users.ts";
import { QUEUE } from "./constants.ts";
import { natsConnection } from "./nats_connection.ts";

class CommentVotedSubscriber extends Subscriber<CommentVotedEvent> {
  readonly subject = Subjects.CommentVoted;
  queue = QUEUE;

  onMessage(message: CommentVotedEvent["message"]): void {
    const { userId, delta } = message;
    log.debug(`Received comment voted event: ${message.commentId}`);
    users.updateOne(
      { _id: userId },
      { $inc: { commentScore: delta } },
    );
  }
}

const commentVotedSubscriber = new CommentVotedSubscriber(natsConnection);

export { commentVotedSubscriber };
