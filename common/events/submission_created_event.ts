import { Event } from "./event.ts";
import { Subjects } from "./subjects.ts";

export interface SubmissionCreatedEvent extends Event {
  subject: Subjects.SubmissionCreated;
  message: {
    id: string;
    topicId: string;
    userId: string;
    title: string;
    url?: string;
  };
}
