import mongoose from 'mongoose';

export interface ITicket {
  title: string;
  price: number;
  userId: string;
}

export interface ITicketDocument extends mongoose.Document {
  title: string;
  price: number;
  userId: string;
}

export interface ITicketModel extends mongoose.Model<ITicketDocument> {
  build(fields: ITicket): ITicketDocument;
}
