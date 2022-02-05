import {
  currentUser,
  DatabaseConnectionError,
  requireAuth,
  validateRequest,
} from '@kenedi337-tickets/common';
import { Router, Request, Response } from 'express';
import { body } from 'express-validator';
import { Ticket } from '../models/Ticket';

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
    const newTicket = Ticket.build({
      ...req.body,
      userId: req.currentUser!.id,
    });
    if (!newTicket) {
      throw new DatabaseConnectionError();
    }
    await newTicket.save();

    res.status(201).send(newTicket);
  }
);

export { router as createTicketRouter };
