/** Standard response from submissions service */
export interface SubmissionResponse {
  title: string;
  url: string;
  score: number;
  userName: string;
  topicName: string;
  createdAt: number;
  commentCount: number;
}
