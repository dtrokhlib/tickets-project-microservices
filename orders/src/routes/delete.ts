import { Router, Request, Response } from 'express';
import { Order } from '../models/Order';
import { OrderStatus, requireAuth } from '@kenedi337-tickets/common';
import { natsWrapper } from '../nats-wrapper';
import { OrderCancelledPublisher } from '../events/publishers/order-cancelled-publisher';
import { Ticket } from '../models/Ticket';

const router = Router();

router.delete(
  '/api/orders/:orderId',
  requireAuth,
  async (req: Request, res: Response) => {
    const { orderId } = req.params;

    const order = await Order.findById(orderId).populate('ticket');

    if (!order) {
      return res.status(404).send({ errors: [{ message: 'Not Found' }] });
    }

    if (order.userId !== req.currentUser!.id) {
      return res.status(404).send({ errors: [{ message: 'Not Found' }] });
    }

    order.status = OrderStatus.Cancelled;
    await order.save();

    new OrderCancelledPublisher(natsWrapper.client).publish({
      id: order.id,
      ticket: {
        id: order.ticket.id
      }
    })

    res.status(204).send(order);
  }
);

export { router as deleteOrderRouter };
