import { Subjects } from "./subjects.ts";

export interface PubSubEvent {
  subject: Subjects;
  message: unknown;
}
