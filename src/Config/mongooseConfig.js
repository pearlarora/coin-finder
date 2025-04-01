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

const updateHours24ForAllCoins = async () => {
  try {
    // Fetch all coins from CoinTableModel
    const coins = await CoinTableModel.find();
    // Fetch all coins from PromotedCoinTableModel
    const promotedCoins = await PromotedCoinTableModel.find();

    // Combine all coins into one array
    const allCoins = [...coins, ...promotedCoins];

    for (const coin of allCoins) {
      try {
        const data = await fetchDexscreenerData(coin.address);
        if (data.pairs && data.pairs.length > 0) {
          const priceChangeH24 = data.pairs[0].priceChange.h24;
          coin.hours24 = priceChangeH24;
        } else {
          coin.hours24 = "";
        }
        await coin.save();
      } catch (error) {
        console.error(
          `Failed to update hours24 for coin with address ${coin.address}:`,
          error
        );
      }
    }

    console.log("Successfully updated hours24 for all coins");
  } catch (error) {
    console.error("Error updating hours24 for all coins:", error);
  }
};

const updateVotes = async () => {
  try {
    await CoinTableModel.updateMany({}, { $inc: { vote: 23 } });
    console.log("Updated votes in CoinTableModel");

    await PromotedCoinTableModel.updateMany({}, { $inc: { vote: 523 } });
    console.log("Updated votes in PromotedCoinTableModel");
  } catch (error) {
    console.error("Error updating votes for all coins:", error);
  }
};

export const connectUsingMongoose = async () => {
  try {
    await mongoose.connect(url);
    console.log("Connected using Mongoose");
    await updateHours24ForAllCoins();
    await updateVotes();
    // Call the migrate function here
    // cron.schedule("0 */6 * * *", async () => {
    //   // This cron job runs every 6 hours
    //   await updateHours24ForAllCoins();
    //   fs.appendFileSync(
    //     "/Users/pearlarora/Pearl/Web Development/Projects/coin-finder/src/cron-log.txt",
    //     `Cron job for hours24 ran at ${new Date().toISOString()}\n`
    //   );
    // });

    // cron.schedule("0 */6 * * *", async () => {
    //   // This cron job runs daily at midnight
    //   await updateVotes();
    //   fs.appendFileSync(
    //     "/Users/pearlarora/Pearl/Web Development/Projects/coin-finder/src/cron-log.txt",
    //     `Cron job for votes ran at ${new Date().toISOString()}\n`
    //   );
    // });
  } catch (error) {
    console.log("Error connecting to DB");
    console.log(error);
  }
};
