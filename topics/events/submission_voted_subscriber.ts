import { log, Subjects, SubmissionVotedEvent, Subscriber } from "../deps.ts";
import { topics } from "../models/topics.ts";
import { QUEUE } from "./constants.ts";
import { natsConnection } from "./nats_connection.ts";

class SubmissionVotedSubscriber extends Subscriber<SubmissionVotedEvent> {
  readonly subject = Subjects.SubmissionVoted;
  queue = QUEUE;

  onMessage(message: SubmissionVotedEvent["message"]): void {
    const { topicId, delta } = message;
    log.debug(`Received submission voted event: ${message.submissionId}`);
    topics.updateOne(
      { _id: topicId },
      { $inc: { submissionScore: delta } },
    );
  }
}

const submissionVotedSubscriber = new SubmissionVotedSubscriber(natsConnection);

export { submissionVotedSubscriber };
