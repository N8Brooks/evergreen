import { Subjects } from "./subjects.ts";

export interface SubmissionCreatedEvent {
  subject: Subjects.SubmissionCreated;
  data: {
    id: string;
    topicId: string;
    userId: string;
    title: string;
    url?: string;
  };
}
