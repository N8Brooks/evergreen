import { CommentVotedEvent, Subjects, Subscriber } from "../deps.ts";
import { topics } from "../models/topics.ts";
import { QUEUE } from "./constants.ts";
import { natsConnection } from "./nats_connection.ts";

class CommentVotedSubscriber extends Subscriber<CommentVotedEvent> {
  readonly subject = Subjects.CommentVoted;
  queue = QUEUE;

  onMessage(message: CommentVotedEvent["message"]): void {
    const { topicId, upVoteDelta, downVoteDelta } = message;
    const debug =
      `Comment vote received for ${topicId}: ${upVoteDelta}, ${downVoteDelta}`;
    console.log(debug);
    topics.updateOne(
      { topicId },
      { $inc: { commentScore: upVoteDelta - downVoteDelta } },
    );
  }
}

const commentVotedSubscriber = new CommentVotedSubscriber(natsConnection);

export { commentVotedSubscriber };
