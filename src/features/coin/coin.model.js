import mongoose from "mongoose";
import { coinSchema } from "./coin.schema.js";

const CoinModel = mongoose.model("Coin", coinSchema);

export default CoinModel;
