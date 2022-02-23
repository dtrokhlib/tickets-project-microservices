import { OrderStatus } from "@kenedi337-tickets/common";
import mongoose from "mongoose";

export interface IOrder {
  id: string;
  version: number;
  userId: string;
  price: number;
  status: OrderStatus;
}

export interface IOrderDocument extends mongoose.Document {
  version: number;
  userId: string;
  price: number;
  status: OrderStatus;
}

export interface IOrderModel extends mongoose.Model<IOrderDocument> {
  build: (fields: IOrder) => IOrderDocument;
}