import mongoose from "mongoose";
import { app } from "./app";

const start = async () => {
  if (!process.env.jwt) {
    throw new Error("jwt secret is not defined");
  }
  if (!process.env.MONGO_URI) {
    throw new Error("MONGO_URI must be defined");
  }
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("[Tickets-project] AUTH service connected to mongodb");
  } catch (err) {
    console.log(err);
  }

  app.listen(3000, () => {
    console.log("[Tickets-project] AUTH service is running on 3000 PORT!");
  });
};

start();
