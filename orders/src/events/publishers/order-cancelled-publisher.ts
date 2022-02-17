import {
  Publisher,
  Subjects,
  OrderCancelledEvent,
} from '@kenedi337-tickets/common';

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
  subject: Subjects.OrderCancelled = Subjects.OrderCancelled;
}
