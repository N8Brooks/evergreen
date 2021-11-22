import { natsConnection } from "./nats_connection.ts";
import { Publisher, Subjects, SubmissionVotedEvent } from "../deps.ts";

class SubmissionVotedPublisher extends Publisher<SubmissionVotedEvent> {
  readonly subject = Subjects.SubmissionVoted;
}

const submissionVotedPublisher = new SubmissionVotedPublisher(
  natsConnection,
);

export { submissionVotedPublisher };
