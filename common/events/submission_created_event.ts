import { Event } from "./event.ts";
import { Subjects } from "./subjects.ts";

export interface SubmissionCreatedEvent extends Event {
  subject: Subjects.SubmissionCreated;
  message: {
    /** ObjectId */
    id: string;

    /** Creation date UTC ms */
    createdAt: number;

    /** Iso 639-1 code */
    language?: string;

    /** Reference to topic */
    topicName: string;

    /** Author */
    userName: string;

    /** Given title */
    title: string;

    /** Associated url */
    url?: string;
  };
}
