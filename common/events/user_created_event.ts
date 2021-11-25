import { Event } from "./event.ts";
import { Subjects } from "./subjects.ts";

export interface UserCreatedEvent extends Event {
  subject: Subjects.UserCreated;
  message: {
    id: string;

    /** User name */
    name: string;
  };
}
