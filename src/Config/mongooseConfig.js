import mongoose from "mongoose";
import dotenv from "dotenv";
// import CoinModel from "./coin.model.js";

dotenv.config();
const url = process.env.DB_URL;

export const connectUsingMongoose = async () => {
  try {
    await mongoose.connect(url);
    console.log("Connected using Mongoose");
  } catch (error) {
    console.log("Error connecting to DB");
    console.log(error);
  }
};
