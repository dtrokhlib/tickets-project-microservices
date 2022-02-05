import { NotFoundError } from '@kenedi337-tickets/common';
import { Router, Request, Response } from 'express';
import { Ticket } from '../models/Ticket';

const router = Router();

router.get('/api/tickets/:id', async (req: Request, res: Response) => {
  const ticket = await Ticket.findById(req.params.id);
  console.log('MY LOG', req.params, ticket);
  if (!ticket) {
    throw new NotFoundError();
  }

  res.send(ticket);
});

export { router as showTicketRouter };
