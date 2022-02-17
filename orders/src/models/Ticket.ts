import { OrderStatus } from '@kenedi337-tickets/common';
import mongoose from 'mongoose';
import {
  ITicket,
  ITicketDocument,
  ITicketModel,
} from './interfaces/ticket.interface';
import { Order } from './Order';

const ticketSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  {
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
      },
    },
  }
);

ticketSchema.statics.build = (fields: ITicket) => {
  return new Ticket(fields);
};

ticketSchema.methods.isReserved = async function () {
  const existingOrder = await Order.findOne({
    ticket: this,
    status: {
      $in: [
        OrderStatus.Created,
        OrderStatus.AwaitingPayment,
        OrderStatus.Complete,
      ],
    },
  });

  return !!existingOrder;
};

const Ticket = mongoose.model<ITicketDocument, ITicketModel>(
  'Ticket',
  ticketSchema
);

export { Ticket };
