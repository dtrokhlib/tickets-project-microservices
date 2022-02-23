import mongoose from 'mongoose';
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
    price: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      required: true,
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
  return new Order({
    _id: fields.id,
    version: fields.version,
    price: fields.price,
    userId: fields.userId,
    status: fields.status,
  });
};

export const Order = mongoose.model<IOrderDocument, IOrderModel>('Order', orderSchema);
