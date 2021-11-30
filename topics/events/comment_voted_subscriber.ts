import { CommentVotedEvent, log, Subjects, Subscriber } from "../deps.ts";
import { topics } from "../models/topics.ts";
import { QUEUE } from "./constants.ts";
import { natsConnection } from "./nats_connection.ts";

class CommentVotedSubscriber extends Subscriber<CommentVotedEvent> {
  readonly subject = Subjects.CommentVoted;
  queue = QUEUE;

  onMessage(message: CommentVotedEvent["message"]): void {
    const { topicId, delta } = message;
    log.debug(`Received comment voted event: ${message.commentId}`);
    topics.updateOne(
      { _id: topicId },
      { $inc: { commentScore: delta } },
    );
  }
}

const commentVotedSubscriber = new CommentVotedSubscriber(natsConnection);

export { commentVotedSubscriber };
