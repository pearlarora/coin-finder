import mongoose from "mongoose";
import dotenv from "dotenv";
import { CoinTableModel } from "../features/coin/coinTable.model.js";

dotenv.config();
const url = process.env.DB_URL;

// Create a migrate function if any field is required to be added in the schema

export const connectUsingMongoose = async () => {
  try {
    await mongoose.connect(url);
    console.log("Connected using Mongoose");
    // Call the migrate function here
  } catch (error) {
    console.log("Error connecting to DB");
    console.log(error);
  }
};
