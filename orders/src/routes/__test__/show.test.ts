import request from 'supertest';
import { app } from '../../app';
import { Ticket } from '../../models/Ticket';

it('fetches the order', async () => {
  const ticket = Ticket.build({
    title: 'concert',
    price: 20,
  });
  await ticket.save();

  const user = global.signin();

  const order = await request(app)
    .post('/api/orders')
    .set('Cookie', user)
    .send({ ticketId: ticket.id })
    .expect(201);

  await request(app)
    .get(`/api/orders/${order.body.id}`)
    .set('Cookie', user)
    .send()
    .expect(200);
});

it('return an error if user tries to access other user order', async () => {
  const ticket = Ticket.build({
    title: 'concert',
    price: 20,
  });
  await ticket.save();

  const user = global.signin();

  const order = await request(app)
    .post('/api/orders')
    .set('Cookie', user)
    .send({ ticketId: ticket.id })
    .expect(201);

  await request(app)
    .get(`/api/orders/${order.body.id}`)
    .set('Cookie', global.signin())
    .send()
    .expect(404);
});
