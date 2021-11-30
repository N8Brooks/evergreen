import { Event } from "./event.ts";
import { Subjects } from "./subjects.ts";

export interface TopicCreatedEvent extends Event {
  subject: Subjects.TopicCreated;
  message: {
    /** Creation UTC ms */
    createdAt: number;

    /** Topic name */
    name: string;

    /** Url unique lowercase topic name */
    uniqueName: string;

    /** User who created the topic */
    userName: string;

    /** Topic description */
    description: string;
  };
}
