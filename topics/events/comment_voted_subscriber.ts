import { CommentVotedEvent, log, Subjects, Subscriber } from "../deps.ts";
import { topics } from "../models/topics.ts";
import { QUEUE } from "./constants.ts";
import { natsConnection } from "./nats_connection.ts";

class CommentVotedSubscriber extends Subscriber<CommentVotedEvent> {
  readonly subject = Subjects.CommentVoted;
  queue = QUEUE;

  onMessage(message: CommentVotedEvent["message"]): void {
    const { topicName, upVoteDelta, downVoteDelta } = message;
    log.debug(`Received comment voted event: ${message.commentId}`);
    topics.updateOne(
      { name: topicName },
      { $inc: { commentScore: upVoteDelta - downVoteDelta } },
    );
  }
}

const commentVotedSubscriber = new CommentVotedSubscriber(natsConnection);

export { commentVotedSubscriber };
