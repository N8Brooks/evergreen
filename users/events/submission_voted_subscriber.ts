import { log, Subjects, SubmissionVotedEvent, Subscriber } from "../deps.ts";
import { users } from "../models/users.ts";
import { QUEUE } from "./constants.ts";
import { natsConnection } from "./nats_connection.ts";

class SubmissionVotedSubscriber extends Subscriber<SubmissionVotedEvent> {
  readonly subject = Subjects.SubmissionVoted;
  queue = QUEUE;

  onMessage(message: SubmissionVotedEvent["message"]): void {
    const { userName, upVoteDelta, downVoteDelta } = message;
    log.debug(`Received submission voted event: ${message.submissionId}`);
    users.updateOne(
      { name: userName },
      { $inc: { submissionScore: upVoteDelta - downVoteDelta } },
    );
  }
}

const submissionVotedSubscriber = new SubmissionVotedSubscriber(natsConnection);

export { submissionVotedSubscriber };
