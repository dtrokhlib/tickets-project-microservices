import request from 'supertest';
import { app } from '../../app';
import mongoose from 'mongoose';

it('request a 404 if the provided id does not exist', async () => {
  const id = new mongoose.Types.ObjectId().toHexString();

  await request(app)
    .put(`/api/tickets/${id}`)
    .set('Cookie', global.signin())
    .send({
      title: 'Test Update',
      price: 100,
    })
    .expect(404);
});

it('request a 401 if the user is not authenticated', async () => {
  const id = new mongoose.Types.ObjectId().toHexString();

  await request(app)
    .put(`/api/tickets/${id}`)
    .send({
      title: 'Test Update',
      price: 100,
    })
    .expect(401);
});

it('request a 401 if the user does not own a ticket', async () => {
  const response = await request(app)
    .post(`/api/tickets/`)
    .set('Cookie', global.signin())
    .send({
      title: 'Test Update',
      price: 100,
    });

  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set('Cookie', global.signin())
    .send({
      title: 'Test Update 2',
      price: 105,
    })
    .expect(401);
});

it('return a 400 if the user provide an invalid title or price', async () => {
  const cookie = global.signin();

  const response = await request(app)
    .post(`/api/tickets/`)
    .set('Cookie', cookie)
    .send({
      title: 'Test Update',
      price: 100,
    });

  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set('Cookie', cookie)
    .send({})
    .expect(400);
});

it('updates a ticket with valid inputes', async () => {
  const cookie = global.signin();

  const response = await request(app)
    .post(`/api/tickets/`)
    .set('Cookie', cookie)
    .send({
      title: 'Test Update',
      price: 100,
    });

  const update = await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set('Cookie', cookie)
    .send({
      title: 'Test Update 2',
      price: 200,
    })
    .expect(200);

  expect(update.body.title).toEqual('Test Update 2');
  expect(update.body.price).toEqual(200);
});
