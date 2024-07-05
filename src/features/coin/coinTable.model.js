import mongoose from "mongoose";
import {
  coinTableSchema,
  promotedCoinTableSchema,
  voteSchema,
} from "./coinTable.schema.js";

const VoteModel = mongoose.model("Vote", voteSchema);
const CoinTableModel = mongoose.model("CoinTable", coinTableSchema);
const PromotedCoinTableModel = mongoose.model(
  "PromotedCoinTable",
  promotedCoinTableSchema
);

export { VoteModel, CoinTableModel, PromotedCoinTableModel };
