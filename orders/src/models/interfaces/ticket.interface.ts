import mongoose from 'mongoose';
import { OrderStatus } from '@kenedi337-tickets/common';

export interface ITicket {
  title: string;
  price: number;
}

export interface ITicketDocument extends mongoose.Document {
  title: string;
  price: number;
  isReserved(): Promise<boolean>;
}

export interface ITicketModel extends mongoose.Model<ITicketDocument> {
  build(fields: ITicket): ITicketDocument;
}
