import { Event } from "./event.ts";
import { Subjects } from "./subjects.ts";

export interface TopicCreatedEvent extends Event {
  subject: Subjects.TopicCreated;
  message: {
    /** Creation date */
    createdAt: Date;

    /** Topic name */
    name: string;

    /** User who created the topic */
    userName: string;

    /** Topic description */
    description: string;
  };
}
