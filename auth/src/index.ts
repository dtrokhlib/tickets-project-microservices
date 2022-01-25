import mongoose from 'mongoose';
import { app } from './app';

const start = async () => {
  if (!process.env.jwt) {
    throw new Error('jwt secret is not defined');
  }

  try {
    await mongoose.connect('mongodb://auth-mongo-srv:27017/auth');
    console.log('[Tickets-project] AUTH service connected to mongodb');
  } catch (err) {
    console.log(err);
  }

  app.listen(3000, () => {
    console.log('[Tickets-project] AUTH service is running on 3000 PORT!');
  });
};

start();
