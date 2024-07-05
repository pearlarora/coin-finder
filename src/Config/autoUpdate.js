import axios from "axios";
import mongoose from "mongoose";
import dotenv from "dotenv";
import fs from "fs";
import cron from "node-cron";
import {
  CoinTableModel,
  PromotedCoinTableModel,
} from "../features/coin/coinTable.model.js";

dotenv.config();
const url = process.env.DB_URL;

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
    const coins = await CoinTableModel.find();
    const promotedCoins = await PromotedCoinTableModel.find();
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

    await PromotedCoinTableModel.updateMany({}, { $inc: { vote: 23 } });
    console.log("Updated votes in PromotedCoinTableModel");
  } catch (error) {
    console.error("Error updating votes for all coins:", error);
  }
};

const runUpdates = async () => {
  try {
    await mongoose.connect(url, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Connected to MongoDB");

    await updateHours24ForAllCoins();
    await updateVotes();

    fs.appendFileSync(
      "/Users/pearlarora/Pearl/Web Development/Projects/coin-finder/src/cron-log.txt",
      `Cron job ran at ${new Date().toISOString()}\n`
    );
  } catch (error) {
    console.error("Update failed", error);
  } finally {
    await mongoose.disconnect();
    console.log("Disconnected from MongoDB");
  }
};

cron.schedule("*/2 * * * *", () => {
  console.log("Running a task every 2 minutes");
  runUpdates();
});

runUpdates(); 
