import { Publisher, OrderCreatedEvent, Subjects } from "@kenedi337-tickets/common";

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
  subject: Subjects.OrderCreated = Subjects.OrderCreated;
}
