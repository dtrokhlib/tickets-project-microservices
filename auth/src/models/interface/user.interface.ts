import mongoose from "mongoose";

export interface IUser {
  email: string;
  password: string;
}

export interface IUserDocument extends mongoose.Document {
  email: string;
  password: string;
}

export interface IUserModel extends mongoose.Model<IUserDocument> {
  build(fields: IUser): any;
}

