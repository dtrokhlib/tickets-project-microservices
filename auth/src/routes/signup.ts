import express, { Response, Request } from 'express';
import { body } from 'express-validator';
import jwt from 'jsonwebtoken';

import { validateRequest } from '../middlewares/validate-request';
import { User } from '../models/User';

const router = express.Router();

router.post(
  '/api/users/signup',
  [
    body('email').isEmail().withMessage('Email must be valid'),
    body('password')
      .trim()
      .isLength({ min: 4, max: 20 })
      .withMessage('Password must be between 4 and 20 characters'),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { email, password } = req.body;

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      console.log('Email in use');
      return res.send({});
    }

    const user = User.build({ email, password });
    await user.save();

    const userJWT = await jwt.sign(
      {
        id: user._id,
        email: user.email,
      },
      process.env.jwt!
    );

    req.session = {
      jwt: userJWT,
    };

    res.status(201).send(user);
  }
);

export { router as signUpRouter };
