import { Event } from "./event.ts";
import { Subjects } from "./subjects.ts";
import { Languages } from "../types/languages.ts";

export interface CommentCreatedEvent extends Event {
  subject: Subjects.CommentCreated;
  message: {
    /** Comment id */
    id: string;

    /** Creation date UTC ms */
    createdAt: number;

    /** Iso 639-1 code */
    language: Languages;

    /** Reference to topic */
    topicName: string;

    /** Author */
    userName: string;

    /** The optional comment this is replying to */
    parentId?: string;

    /** The submission this is in */
    submissionId: string;

    /** Comment body */
    text: string;
  };
}
