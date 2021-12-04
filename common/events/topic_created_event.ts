import { Event } from "./event.ts";
import { Subjects } from "./subjects.ts";

export interface TopicCreatedEvent extends Event {
  subject: Subjects.TopicCreated;
  message: {
    /** Url unique lowercase name */
    id: string;

    /** Creation UTC ms */
    createdAt: number;

    /** Topic name */
    name: string;

    /** User who created the topic */
    userId: string;

    /** User who created the topic */
    userName: string;

    /** Topic description */
    description: string;
  };
}
