import { Subjects, SubmissionVotedEvent, Subscriber } from "../deps.ts";
import { topics } from "../models/topics.ts";
import { QUEUE } from "./constants.ts";
import { natsConnection } from "./nats_connection.ts";

class SubmissionVotedSubscriber extends Subscriber<SubmissionVotedEvent> {
  readonly subject = Subjects.SubmissionVoted;
  queue = QUEUE;

  onMessage(message: SubmissionVotedEvent["message"]): void {
    const { topicId, upVoteDelta, downVoteDelta } = message;
    const debug =
      `Submission vote received for ${topicId}: ${upVoteDelta}, ${downVoteDelta}`;
    console.log(debug);
    topics.updateOne(
      { topicId },
      { $inc: { submissionScore: upVoteDelta - downVoteDelta } },
    );
  }
}

const submissionVotedSubscriber = new SubmissionVotedSubscriber(natsConnection);

export { submissionVotedSubscriber };
