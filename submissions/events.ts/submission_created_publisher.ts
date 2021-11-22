import { natsConnection } from "./nats_connection.ts";
import { Publisher, Subjects, SubmissionCreatedEvent } from "../deps.ts";

class SubmissionCreatedPublisher extends Publisher<SubmissionCreatedEvent> {
  readonly subject = Subjects.SubmissionCreated;
}

const submissionCreatedPublisher = new SubmissionCreatedPublisher(
  natsConnection,
);

export { submissionCreatedPublisher };
