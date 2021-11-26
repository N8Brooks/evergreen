import { Event } from "./event.ts";
import { Subjects } from "./subjects.ts";

export interface UserCreatedEvent extends Event {
  subject: Subjects.UserCreated;
  message: {
    /** User id */
    id: string;

    /** Creation date */
    createdAt: Date;

    /** User name */
    name: string;
  };
}
