import mongoose from 'mongoose';
import { OrderStatus } from '@kenedi337-tickets/common';
import { ITicketDocument } from './ticket.interface';

export interface IOrder {
  userId: string;
  status: OrderStatus;
  expiresAt: Date;
  ticket: ITicketDocument;
}

export interface IOrderDocument extends mongoose.Document {
  userId: string;
  status: OrderStatus;
  expiresAt: Date;
  ticket: ITicketDocument;
}

export interface IOrderModel extends mongoose.Model<IOrderDocument> {
  build(fields: IOrder): IOrderDocument;
}
