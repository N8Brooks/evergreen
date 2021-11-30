import { Event } from "./event.ts";
import { Subjects } from "./subjects.ts";

export interface CommentCreatedEvent extends Event {
  subject: Subjects.CommentCreated;
  message: {
    /** ObjectId */
    id: string;

    /** Creation date UTC ms */
    createdAt: number;

    /** Iso 639-1 code */
    language?: string;

    /** Reference to topic */
    topicId: string;

    /** Reference to topic */
    topicName: string;

    /** Author id */
    userId: string;

    /** Author name */
    userName: string;

    /** The optional comment this is replying to */
    parentId?: string;

    /** The submission this is in */
    submissionId: string;

    /** Comment body */
    text: string;
  };
}
