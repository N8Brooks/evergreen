import { log, Subjects, SubmissionCreatedEvent, Subscriber } from "../deps.ts";
import { submissions } from "../models/submissions.ts";
import { QUEUE } from "./constants.ts";
import { natsConnection } from "./nats_connection.ts";

class SubmissionCreatedSubscriber extends Subscriber<SubmissionCreatedEvent> {
  readonly subject = Subjects.SubmissionCreated;
  queue = QUEUE;

  onMessage(message: SubmissionCreatedEvent["message"]): void {
    log.debug(`Received submission created event: ${message.title}`);
    const {
      id,
      topicName,
    } = message;

    submissions.insertOne({
      _id: id,
      topicName,
    });
  }
}

const submissionCreatedSubscriber = new SubmissionCreatedSubscriber(
  natsConnection,
);

export { submissionCreatedSubscriber };
