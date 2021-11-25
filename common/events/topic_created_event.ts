import { Event } from "./event.ts";
import { Subjects } from "./subjects.ts";

export interface TopicCreatedEvent extends Event {
  subject: Subjects.TopicCreated;
  message: {
    id: string;

    /** Topic name */
    name: string;

    /** User who created the topic */
    userId: string;

    /** Topic description */
    description: string;
  };
}
