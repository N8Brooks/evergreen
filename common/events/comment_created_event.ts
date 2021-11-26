import { Event } from "./event.ts";
import { Subjects } from "./subjects.ts";
import { Languages } from "../types/languages.ts";

export interface CommentCreatedEvent extends Event {
  subject: Subjects.CommentCreated;
  message: {
    /** Comment id */
    id: string;

    /** Creation date */
    createdAt: Date;

    /** Iso 639-1 code */
    language: Languages;

    /** Reference to topic */
    topicId: string;

    /** Author */
    userId: string;

    /** The optional comment this is replying to */
    parentId?: string;

    /** The submission this is in */
    submissionId: string;

    /** Comment body */
    text: string;
  };
}
