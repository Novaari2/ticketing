import { Publisher, OrderCreatedEvent, Subjects } from "@nvatickets/common";

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
    subject: Subjects.OrderCreated = Subjects.OrderCreated;
}