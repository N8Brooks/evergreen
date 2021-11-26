import { CommentVotedEvent, Subjects, Subscriber } from "../deps.ts";
import { users } from "../models/users.ts";
import { QUEUE } from "./constants.ts";
import { natsConnection } from "./nats_connection.ts";

class CommentVotedSubscriber extends Subscriber<CommentVotedEvent> {
  readonly subject = Subjects.CommentVoted;
  queue = QUEUE;

  onMessage(message: CommentVotedEvent["message"]): void {
    const { userName, upVoteDelta, downVoteDelta } = message;
    const debug =
      `Comment vote received for ${userName}: ${upVoteDelta}, ${downVoteDelta}`;
    console.log(debug);
    users.updateOne(
      { userName },
      { $inc: { commentScore: upVoteDelta - downVoteDelta } },
    );
  }
}

const commentVotedSubscriber = new CommentVotedSubscriber(natsConnection);

export { commentVotedSubscriber };
