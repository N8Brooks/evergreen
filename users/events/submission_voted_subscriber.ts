import { log, Subjects, SubmissionVotedEvent, Subscriber } from "../deps.ts";
import { users } from "../models/users.ts";
import { QUEUE } from "./constants.ts";
import { natsConnection } from "./nats_connection.ts";

class SubmissionVotedSubscriber extends Subscriber<SubmissionVotedEvent> {
  readonly subject = Subjects.SubmissionVoted;
  queue = QUEUE;

  onMessage(message: SubmissionVotedEvent["message"]): void {
    const { userId, delta } = message;
    log.debug(`Received submission voted event: ${message.submissionId}`);
    users.updateOne(
      { _id: userId },
      { $inc: { submissionScore: delta } },
    );
  }
}

const submissionVotedSubscriber = new SubmissionVotedSubscriber(natsConnection);

export { submissionVotedSubscriber };
