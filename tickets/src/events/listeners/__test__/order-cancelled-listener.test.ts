import mongoose from "mongoose";
import { OrderCancelledListener } from "../order-cancelled-listener";
import { Ticket } from "../../../models/ticket";
import { natsWrapper } from "../../../nats-wrapper";
import { OrderCancelledEvent } from "@nvatickets/common";
import { Message } from "node-nats-streaming";

const setup = async () => {
    // Create an instance of the listener
    const listener = new OrderCancelledListener(natsWrapper.client);
    
    const orderId = new mongoose.Types.ObjectId().toHexString();

    // Create and save a ticket
    const ticket = Ticket.build({
        title: 'concert',
        price: 99,
        userId: 'asdf'
    });
    ticket.set({ orderId });
    await ticket.save();
    
    // Create a fake data event
    const data: OrderCancelledEvent['data'] = {
        id: new mongoose.Types.ObjectId().toHexString(),
        version: 0,
        ticket: {
            id: ticket.id,
        },
    };
    
    // Create a fake message object
    // @ts-ignore
    const msg: Message = {
        ack: jest.fn(),
    };
    
    return { listener, ticket, data, msg };
}

it('updates the ticket, publishes an event, and acks the message', async () => {
    const { listener, ticket, data, msg } = await setup();
    
    await listener.onMessage(data, msg);
    
    const updatedTicket = await Ticket
        .findById(ticket.id);
    
    expect(updatedTicket).toBeDefined();
    expect(updatedTicket!.orderId).not.toBeDefined();
    expect(msg.ack).toHaveBeenCalled();
    expect(natsWrapper.client.publish).toHaveBeenCalled();
});