import { NotFoundError } from '@kenedi337-tickets/common';
import express, { Request, Response } from 'express';
import { Ticket } from '../models/Ticket';

const router = express.Router();

router.get('/api/tickets/:id', async (req: Request, res: Response) => {
  const ticket = await Ticket.findById(req.params.id);

  if (!ticket) {
    return res.status(404).send({ errors: [{ message: 'Not Found' }] });
  }

  res.send(ticket);
});

export { router as showTicketRouter };
