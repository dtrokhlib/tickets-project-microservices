import {
  DatabaseConnectionError,
  requireAuth,
  validateRequest,
} from '@kenedi337-tickets/common';
import { Router, Request, Response } from 'express';
import { body } from 'express-validator';
import { Ticket } from '../models/Ticket';
import { natsWrapper } from '../nats-wrapper';
import { TicketCreatedPublisher } from '../events/publishers/ticket-created-publisher';

const router = Router();

router.post(
  '/api/tickets',
  requireAuth,
  [
    body('title').trim().notEmpty().withMessage('Title is required'),
    body('price')
      .trim()
      .isFloat({ gt: 0 })
      .withMessage('Price must be greater than 10'),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const ticket = Ticket.build({
      ...req.body,
      userId: req.currentUser!.id,
    });
    if (!ticket) {
      throw new DatabaseConnectionError();
    }
    await ticket.save();
    await new TicketCreatedPublisher(natsWrapper.client).publish({
      id: ticket.id,
      version: ticket.version,
      title: ticket.title,
      price: ticket.price,
      userId: ticket.userId,
    });

    res.status(201).send(ticket);
  }
);

export { router as createTicketRouter };
