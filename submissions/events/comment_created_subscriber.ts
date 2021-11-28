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

  async onMessage(message: CommentCreatedEvent["message"]): Promise<void> {
    const { id, submissionId } = message;

    log.debug(`Received comment created event: ${id}`);

    const { modifiedCount } = await submissions.updateOne(
      { _id: new Bson.ObjectId(submissionId) },
      { $inc: { commentCount: 1 } },
    );

    if (modifiedCount !== 1) {
      log.warning(
        `Comment ${id} for submission ${submissionId} modified ${modifiedCount} documents`,
      );
    }
  }
}

const commentCreatedSubscriber = new CommentCreatedSubscriber(natsConnection);

export { commentCreatedSubscriber };
