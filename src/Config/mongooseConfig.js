import mongoose from "mongoose";
import dotenv from "dotenv";
import axios from "axios";
import {
  CoinTableModel,
  PromotedCoinTableModel,
} from "../features/coin/coinTable.model.js";

dotenv.config();
const url = process.env.DB_URL;

// Create a migrate function if any field is required to be added in the schema
const fetchDexscreenerData = async (query) => {
  try {
    const response = await axios.get(
      `https://api.dexscreener.com/latest/dex/search/?q=${query}`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching data from Dexscreener API:", error);
    throw new Error("Failed to fetch data from Dexscreener API");
  }
};

const updateHours24ForAllCoins = async (query) => {
  try {
    const data = await fetchDexscreenerData(query);
    const priceChangeH24 = data.pairs[0].priceChange.h24;

    // Update all coins in CoinTableModel
    await CoinTableModel.updateMany({}, { $set: { hours24: priceChangeH24 } });

    // Update all coins in PromotedCoinTableModel
    await PromotedCoinTableModel.updateMany(
      {},
      { $set: { hours24: priceChangeH24 } }
    );

    console.log("Successfully updated hours24 for all coins");
  } catch (error) {
    console.error("Error updating hours24 for all coins:", error);
  }
};

export const connectUsingMongoose = async () => {
  try {
    await mongoose.connect(url);
    console.log("Connected using Mongoose");
    // Call the migrate function here
    await updateHours24ForAllCoins("query");
  } catch (error) {
    console.log("Error connecting to DB");
    console.log(error);
  }
};
