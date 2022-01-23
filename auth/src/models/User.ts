import mongosee from 'mongoose';
import { IUser, IUserModel, IUserDocument } from './interface/user.interface';
import { Password } from '../services/password';

const userSchema = new mongosee.Schema(
  {
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
  },
  {
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.password;
        delete ret.__v;
      },
    },
  }
);

userSchema.statics.build = (fields: IUser) => {
  return new User(fields);
};

userSchema.pre('save', async function (done) {
  if (this.isModified('password')) {
    const hashed = await Password.toHash(this.password);
    this.set('password', hashed);
  }

  done();
});

const User = mongosee.model<IUserDocument, IUserModel>('User', userSchema);

export { User };
