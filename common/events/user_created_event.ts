import { Event } from "./event.ts";
import { Subjects } from "./subjects.ts";

export interface UserCreatedEvent extends Event {
  subject: Subjects.UserCreated;
  message: {
    /** Creation date UTC ms */
    createdAt: number;

    /** User name */
    name: string;

    /** Url unique lowercase user name */
    uniqueName: string;
  };
}
