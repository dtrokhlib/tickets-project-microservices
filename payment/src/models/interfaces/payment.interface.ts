import mongoose from 'mongoose';

export interface IPayment {
  id: string;
  version: number;
}

export interface IPaymentDocument extends mongoose.Document {
  version: number;
  userId: string;
}

export interface IPaymentModel extends mongoose.Model<IPaymentDocument> {
  build: (fields: IPayment) => IPaymentDocument;
}
