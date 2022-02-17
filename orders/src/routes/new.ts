import { Router, Request, Response } from 'express';
import { requireAuth, validateRequest } from '@kenedi337-tickets/common';
import { body } from 'express-validator';
import mongoose from 'mongoose';
import { Ticket } from '../models/Ticket';
import { Order } from '../models/Order';
import { OrderStatus } from '@kenedi337-tickets/common';
import { OrderCreatedPublisher } from '../events/publishers/order-created-publisher';
import { natsWrapper } from '../nats-wrapper';

const router = Router();

const EXPIRATION_WINDOW_SECONDS = 15 * 60;

router.post(
  '/api/orders',
  requireAuth,
  [
    body('ticketId')
      .not()
      .isEmpty()
      .custom((input: string) => mongoose.Types.ObjectId.isValid(input))
      .withMessage('TicketId must be provided'),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { ticketId } = req.body;

    // Find the ticket the user is trying to order in the database
    const ticket = await Ticket.findById(ticketId);
    if (!ticket) {
      return res.status(404).send({ errors: [{ message: 'Not Found' }] });
    }

    // Make sure that this ticket is not already reserved
    const isReserved = await ticket.isReserved();
    if (isReserved) {
      return res
        .status(400)
        .send({ errors: [{ message: 'Ticket is already reserved' }] });
    }

    // Calculate an expiration date for this order
    const expiration = new Date();
    expiration.setSeconds(expiration.getSeconds() + EXPIRATION_WINDOW_SECONDS);

    // Build the order and save it to the database
    const order = Order.build({
      userId: req.currentUser!.id,
      status: OrderStatus.Created,
      expiresAt: expiration,
      ticket,
    });
    await order.save();

    // Publish an event saying that an order was created
    new OrderCreatedPublisher(natsWrapper.client).publish({
      id: order.id,
      status: order.status,
      userId: order.userId,
      expiresAt: order.expiresAt.toISOString(),
      ticket:{
        id: ticket.id,
        price: ticket.price
      }
    })

    res.status(201).send(order);
  }
);

export { router as newOrderRouter };
