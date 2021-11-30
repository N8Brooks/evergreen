import { Event } from "./event.ts";
import { Subjects } from "./subjects.ts";

export interface UserCreatedEvent extends Event {
  subject: Subjects.UserCreated;
  message: {
    /** Url unique lowercase name */
    id: string;

    /** Creation date UTC ms */
    createdAt: number;

    /** User name */
    name: string;
  };
}
