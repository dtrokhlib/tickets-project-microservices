import mongoose from 'mongoose';
import { OrderStatus } from '@kenedi337-tickets/common';
import {
  IOrder,
  IOrderDocument,
  IOrderModel,
} from './interfaces/order.interface';
import { updateIfCurrentPlugin } from 'mongoose-update-if-current';

const orderSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      required: true,
      enum: Object.values(OrderStatus),
      default: OrderStatus.Created,
    },
    expiresAt: {
      type: mongoose.Schema.Types.Date,
    },
    ticket: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Ticket',
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

orderSchema.set('versionKey', 'version');
orderSchema.plugin(updateIfCurrentPlugin);

orderSchema.statics.build = (fields: IOrder) => {
  return new Order(fields);
};

const Order = mongoose.model<IOrderDocument, IOrderModel>('Order', orderSchema);

export { Order };
