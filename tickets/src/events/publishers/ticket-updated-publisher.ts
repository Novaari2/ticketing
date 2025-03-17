import { Publisher, Subjects, TicketUpdatedEvent } from "@nvatickets/common";

export class TicketUpdatePublisher extends Publisher<TicketUpdatedEvent> {
    subject: Subjects.TicketUpdated = Subjects.TicketUpdated;
}