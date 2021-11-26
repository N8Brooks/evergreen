import { Event } from "./event.ts";
import { Subjects } from "./subjects.ts";

export interface UserCreatedEvent extends Event {
  subject: Subjects.UserCreated;
  message: {
    /** Creation date */
    createdAt: Date;

    /** User name */
    name: string;
  };
}
