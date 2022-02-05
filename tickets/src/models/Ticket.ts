import mongosee from 'mongoose';
import {
  ITicket,
  ITicketModel,
  ITicketDocument,
} from './interfaces/ticket.interface';

const ticketSchema = new mongosee.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    userId: {
      type: String,
      required: true,
    },
  },
  {
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
      },
    },
  }
);

ticketSchema.statics.build = (fields: ITicket) => {
  return new Ticket(fields);
};

const Ticket = mongosee.model<ITicketDocument, ITicketModel>(
  'Ticket',
  ticketSchema
);

export { Ticket };
