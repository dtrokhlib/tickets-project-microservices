import {
  Publisher,
  Subjects,
  TicketUpdatedEvent,
} from '@kenedi337-tickets/common';

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
  subject: Subjects.TicketUpdated = Subjects.TicketUpdated;
}
