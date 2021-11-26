import { Subjects, SubmissionVotedEvent, Subscriber } from "../deps.ts";
import { users } from "../models/users.ts";
import { QUEUE } from "./constants.ts";
import { natsConnection } from "./nats_connection.ts";

class SubmissionVotedSubscriber extends Subscriber<SubmissionVotedEvent> {
  readonly subject = Subjects.SubmissionVoted;
  queue = QUEUE;

  onMessage(message: SubmissionVotedEvent["message"]): void {
    const { userId, upVoteDelta, downVoteDelta } = message;
    const debug =
      `Submission vote received for ${userId}: ${upVoteDelta}, ${downVoteDelta}`;
    console.log(debug);
    users.updateOne(
      { userId },
      { $inc: { submissionScore: upVoteDelta - downVoteDelta } },
    );
  }
}

const submissionVotedSubscriber = new SubmissionVotedSubscriber(natsConnection);

export { submissionVotedSubscriber };
