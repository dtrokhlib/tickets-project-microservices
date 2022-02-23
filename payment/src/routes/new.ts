import { Router, Request, Response } from 'express';
import { body } from 'express-validator';
import {
  requireAuth,
  validateRequest,
  BadRequestError,
  NotFoundError,
  NotAuthorizedError,
  OrderStatus,
} from '@kenedi337-tickets/common';
import { Order } from '../models/order';
import { stripe } from '../stripe';

const router = Router();

router.post(
  '/api/payments',
  requireAuth,
  [body('token').not().isEmpty(), body('orderId').not().isEmpty()],
  validateRequest,
  async (req: Request, res: Response) => {
    const { token, orderId } = req.body;

    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).send({ errors: [{ message: 'Not Found' }] });
    }

    if (order.userId !== req.currentUser!.id) {
      return res.status(401).send({ errors: [{ message: 'Not Authorized' }] });
    }
    if (order.status === OrderStatus.Cancelled) {
      return res
        .status(400)
        .send({ errors: [{ message: 'Cannot pay for cancelled order' }] });
    }

    await stripe.charges.create({
      currency: 'usd',
      amount: order.price * 100,
      source: token,
    });

    res.status(201).send({ success: true });
  }
);

export { router as createChargeRouter };
