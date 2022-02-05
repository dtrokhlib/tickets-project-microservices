import express from 'express';
import cookieSession from 'cookie-session';
import { errorHandler } from '@kenedi337-tickets/common';
import { NotFoundError } from '@kenedi337-tickets/common';

import 'express-async-errors';

const app = express();
app.set('trust proxy', true);
app.use(express.json());
app.use(
  cookieSession({
    signed: false,
    secure: process.env.NODE_ENV !== 'test' ? true : false,
  })
);


app.all('*', async (req, res) => {
  throw new NotFoundError();
});

app.use(errorHandler);

export { app };