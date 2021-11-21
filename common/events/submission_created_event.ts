import { PubSubEvent } from "./pub_sub_event.ts";
import { Subjects } from "./subjects.ts";

export interface SubmissionCreatedEvent extends PubSubEvent {
  subject: Subjects.SubmissionCreated;
  message: {
    id: string;
    topicId: string;
    userId: string;
    title: string;
    url?: string;
  };
}
