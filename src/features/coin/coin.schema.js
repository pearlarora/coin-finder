import mongoose from "mongoose";

export const coinSchema = new mongoose.Schema({
  logo: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  symbol: {
    type: String,
    required: true,
  },
  network: {
    type: String,
    required: true,
    enum: ["BSC", "ETH", "MATIC", "SOL", "FTM", "TRX", "BASE", "OTHER"],
  },
  projectInPresale: Boolean,
  presaleStartDate: Date,
  presaleEndDate: Date,
  launchDateKnown: Boolean,
  launchDate: Date,
  address: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  website: {
    type: String,
    required: true,
  },
  telegram: {
    type: String,
    required: true,
  },
  twitter: String,
  discord: String,
  email: {
    type: String,
    unique: true,
    required: true,
    match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Please enter a valid email"],
  },
  telegramContact: {
    type: String,
    required: true,
  },
  marketCapUsd: String,
  hours24: String,
  reviewed: { type: Boolean, default: false },
  vote: {
    type: Number,
    default: 0,
  },
  graph: {
    type: String,
    default: "",
  },
});
