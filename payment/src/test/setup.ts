import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import { app } from '../app';
import request from 'supertest';
import jwt from 'jsonwebtoken';

declare global {
  function signin(id?: string): string[];
}

jest.mock('../nats-wrapper');
jest.setTimeout(5000);

let mongo: any;
process.env.STRIPE_KEY =
  'sk_test_51KWQnqGKQKYaZPyyVwq2knQu8ncOF1s7mY4zCc9Di8EH1YK9vogYB0m7k4HPgVHQj8nMmfYn8JQPpZA4v6me5i6z00Bp8oWWac';

beforeAll(async () => {
  process.env.jwt = 'test-jest';

  mongo = await MongoMemoryServer.create();
  const mongoUri = mongo.getUri();

  await mongoose.connect(mongoUri);
});

beforeEach(async () => {
  jest.setTimeout(60000);
  jest.clearAllMocks();
  const collections = await mongoose.connection.db.collections();

  for (let collection of collections) {
    await collection.deleteMany({});
  }
});

afterAll(async () => {
  await mongo.stop();
  await mongoose.connection.close();
});

global.signin = (id?: string) => {
  const payload = {
    id: id || new mongoose.Types.ObjectId().toHexString(),
    email: 'test@test.com',
  };
  const token = jwt.sign(payload, process.env.jwt!);
  const session = { jwt: token };
  const sessionJSON = JSON.stringify(session);
  const base64 = Buffer.from(sessionJSON).toString('base64');

  return [`session=${base64}`];
};
