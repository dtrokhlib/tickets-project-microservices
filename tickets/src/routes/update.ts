import { Router, Response, Request } from 'express';
import { body } from 'express-validator';
import { validateRequest, requireAuth } from '@kenedi337-tickets/common';
import { Ticket } from '../models/Ticket';
import { natsWrapper } from '../nats-wrapper';
import { TicketUpdatedPublisher } from '../events/publishers/ticket-updated-publisher';

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
    if (ticket.userId !== req.currentUser!.id) {
      return res.status(401).send({ errors: [{ message: 'Not Authorized' }] });
    }

    if (ticket.orderId) {
      return res
        .status(400)
        .send({ errors: [{ message: 'Reserved ticket cannot be edited' }] });
    }

    ticket.title = title;
    ticket.price = price;
    await ticket.save();
    await new TicketUpdatedPublisher(natsWrapper.client).publish({
      id: ticket.id,
      version: ticket.version,
      title: ticket.title,
      price: ticket.price,
      userId: ticket.userId,
    });

    res.send(ticket);
  }
);

export { router as updateTicketRouter };
