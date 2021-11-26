import { Subjects, SubmissionCreatedEvent, Subscriber } from "../deps.ts";
import { submissions } from "../models/submissions.ts";
import { QUEUE } from "./constants.ts";
import { natsConnection } from "./nats_connection.ts";

class SubmissionCreatedSubscriber extends Subscriber<SubmissionCreatedEvent> {
  readonly subject = Subjects.SubmissionCreated;
  queue = QUEUE;

  onMessage(message: SubmissionCreatedEvent["message"]): void {
    console.log("New submission", message.name);
    const {
      id,
      topicId,
    } = message;

    submissions.insertOne({
      _id: id,
      topicId,
    });
  }
}

const submissionCreatedSubscriber = new SubmissionCreatedSubscriber(
  natsConnection,
);

export { submissionCreatedSubscriber };
