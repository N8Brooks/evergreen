import { Event } from "./event.ts";
import { Subjects } from "./subjects.ts";
import { Languages } from "../types/languages.ts";

export interface SubmissionCreatedEvent extends Event {
  subject: Subjects.SubmissionCreated;
  message: {
    /** Submission id */
    id: string;

    /** Creation date */
    createdAt: Date;

    /** Iso 639-1 code */
    language: Languages;

    /** Reference to topic */
    topicId: string;

    /** Author */
    userId: string;

    /** Given title */
    name: string;

    /** Associated url */
    url?: string;
  };
}
