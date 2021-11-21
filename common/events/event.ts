import { Subjects } from "./subjects.ts";

export interface Event {
  subject: Subjects;
  message: unknown;
}
