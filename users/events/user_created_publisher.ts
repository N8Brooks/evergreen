import { natsConnection } from "./nats_connection.ts";
import { Publisher, Subjects, UserCreatedEvent } from "../deps.ts";

class UserCreatedPublisher extends Publisher<UserCreatedEvent> {
  readonly subject = Subjects.UserCreated;
}

const userCreatedPublisher = new UserCreatedPublisher(
  natsConnection,
);

export { userCreatedPublisher };
