import {
  Publisher,
  Subjects,
  TicketCreatedEvent,
} from '@kenedi337-tickets/common';

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
  subject: Subjects.TicketCreated = Subjects.TicketCreated;
}
