import { Router, Response, Request } from 'express';
import { body } from 'express-validator';
import {
  validateRequest,
  NotFoundError,
  requireAuth,
  NotAuthorizedError,
} from '@kenedi337-tickets/common';
import { Ticket } from '../models/Ticket';

const router = Router();

router.put(
  '/api/tickets/:id',
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
    const { title, price } = req.body;
    const ticket = await Ticket.findById(req.params.id);

    if (!ticket) {
      return res.status(404).send({ errors: [{ message: 'Not Found' }] });
    }
    console.log(ticket.userId, req.currentUser!.id)
    if (ticket.userId !== req.currentUser!.id) {
      return res.status(401).send({ errors: [{ message: 'Not Authorized' }] });
    }

    ticket.title = title;
    ticket.price = price;
    await ticket.save();

    res.send(ticket);
  }
);

export { router as updateTicketRouter };
