import {
  Bson,
  CommentCreatedEvent,
  log,
  Subjects,
  Subscriber,
} from "../deps.ts";
import { submissions } from "../models/submissions.ts";
import { QUEUE } from "./constants.ts";
import { natsConnection } from "./nats_connection.ts";

class CommentCreatedSubscriber extends Subscriber<CommentCreatedEvent> {
  readonly subject = Subjects.CommentCreated;
  queue = QUEUE;

  onMessage(message: CommentCreatedEvent["message"]): void {
    const { id, submissionId } = message;
    log.debug(`Received comment created event: ${id}`);
    submissions.updateOne(
      { _id: new Bson.ObjectId(submissionId) },
      { $inc: { commentCount: 1 } },
    );
  }
}

const commentCreatedSubscriber = new CommentCreatedSubscriber(natsConnection);

export { commentCreatedSubscriber };
