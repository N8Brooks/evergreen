export const SubmissionCreatedSubject = "submission:created";

export interface SubmissionCreatedMessage {
  id: string;
  topicId: string;
  userId: string;
  title: string;
  url?: string;
}
