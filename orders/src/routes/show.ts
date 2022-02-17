import { requireAuth } from '@kenedi337-tickets/common';
import { Router, Request, Response } from 'express';
import { Order } from '../models/Order';

const router = Router();

router.get(
  '/api/orders/:orderId',
  requireAuth,
  async (req: Request, res: Response) => {
    const order = await Order.findById(req.params.orderId).populate('ticket');

    if (!order) {
      return res.status(404).send({ errors: [{ message: 'Not Found' }] });
    }

    if(order.userId !== req.currentUser!.id) {
      return res.status(404).send({ errors: [{ message: 'Not Found' }] });
    }

    res.send(order);
  }
);

export { router as showOrderRouter };
