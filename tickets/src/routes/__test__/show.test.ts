import request from 'supertest';
import { app } from '../../app';
import mongoose from 'mongoose';

it('returns a 404 if the ticket is not found', async () => {
  const id = new mongoose.Types.ObjectId().toHexString();

  const response = await request(app)
    .get(`/api/tickets/${id}`)
    .send({})
    .expect(404);
});

it('returns the ticket if the ticket is found', async () => {
  const data = {
    title: 'test jest',
    price: 10,
  };

  const newTicket = await request(app)
    .post('/api/tickets')
    .set('Cookie', global.signin())
    .send(data)
    .expect(201);

  const ticket = await request(app)
    .get(`/api/tickets/${newTicket.body.id}`)
    .send({})
    .expect(200);
});
