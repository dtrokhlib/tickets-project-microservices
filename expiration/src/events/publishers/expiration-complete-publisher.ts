import { Subjects, Publisher, ExpirationCompleteEvent } from "@kenedi337-tickets/common";

export class ExpirationCompletePublisher extends Publisher<ExpirationCompleteEvent> {
  subject: Subjects.ExpirationComplete = Subjects.ExpirationComplete;
}