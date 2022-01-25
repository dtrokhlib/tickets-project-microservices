import request from 'supertest';
import { app } from '../../app';

it('fails when email does not exist', async () => {
  return request(app)
    .post('/api/users/signin')
    .send({
      email: 'test@test.com',
      password: 'test',
    })
    .expect(400);
});

it('fails when incorrect password provided', async () => {
  await request(app)
    .post('/api/users/signup')
    .send({
      email: 'test@test.com',
      password: 'test',
    })
    .expect(201);

  await request(app)
    .post('/api/users/signin')
    .send({
      email: 'test@test.com',
      password: 'test1',
    })
    .expect(400);
});

it('response with a cookie with given correct credentials', async () => {
  await request(app)
    .post('/api/users/signup')
    .send({
      email: 'test@test.com',
      password: 'test',
    })
    .expect(201);

  const response = await request(app)
    .post('/api/users/signin')
    .send({
      email: 'test@test.com',
      password: 'test',
    })
    .expect(200);

    expect(response.get('Set-Cookie')).toBeDefined();
  });
