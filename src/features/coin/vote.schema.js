import mongoose from "mongoose";

export const voteSchema = new mongoose.Schema({
  coin: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Coin",
  },
  vote: Number,
});
