import request from 'supertest';
import { app } from '../../app';

it('return a 201 on successful signup', async () => {
  return request(app)
    .post('/api/users/signup')
    .send({
      email: 'test@test.com',
      password: 'test',
    })
    .expect(201);
});

it('return a 400 with invalid password', async () => {
  return request(app)
    .post('/api/users/signup')
    .send({
      email: 'test@test.com',
      password: 't',
    })
    .expect(400);
});

it('return a 400 with invalid email', async () => {
  return request(app)
    .post('/api/users/signup')
    .send({
      email: 'test',
      password: 'test',
    })
    .expect(400);
});

it('return a 400 with invalid password and email', async () => {
  return request(app)
    .post('/api/users/signup')
    .send({
      email: 't',
      password: 't',
    })
    .expect(400);
});

it('dissalow duplicate emails', async () => {
  await request(app)
    .post('/api/users/signup')
    .send({
      email: 'test@test.com',
      password: 'test',
    })
    .expect(201);

  await request(app)
    .post('/api/users/signup')
    .send({
      email: 'test@test.com',
      password: 'test',
    })
    .expect(400);
});

it('sets a cookie after successful signup', async () => {
    const response = await request(app)
      .post('/api/users/signup')
      .send({
        email: 'test@test.com',
        password: 'test',
      })
      .expect(201);

    expect(response.get('Set-Cookie')).toBeDefined();
}) 
