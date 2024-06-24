// // import axios from "axios";
// // import CoinModel from "./coin.model.js";

// // export default class CoinRepository {
// //   async getAll() {
// //     const siteUrl =
// //       "https://api.geckoterminal.com/api/v2/networks/trending-pools";
// //     try {
// //       const { data } = await axios({
// //         method: "GET",
// //         url: siteUrl,
// //         headers: {
// //           "Content-Type": "application/json",
// //         },
// //       });
// //       console.log(data);
// //       return data.json();
// //     } catch (e) {
// //       console.log(e);
// //     }
// //   }

// //   async add(newCoin) {
// //     const address = newCoin.address;
// //     const response = await axios.get(
// //       `https://api.geckoterminal.com/api/v2/search/pools?query=${address}`
// //     );
// //     const responseData = response.data.data[0]?.attributes;
// //     const marketCapUsd = responseData?.market_cap_usd;
// //     const hours24 = responseData?.price_change_percentage?.h24;

// //     newCoin.marketCapUsd = marketCapUsd;
// //     newCoin.hours24 = hours24;

// //     const coin = new CoinModel(newCoin);
// //     const savedCoin = await coin.save();
// //     return savedCoin;
// //   }
// // }

// import axios from "axios";
// import CoinModel from "./coin.model.js";
// import {
//   CoinTableModel,
//   PromotedCoinTableModel,
//   VoteModel,
// } from "./coinTable.model.js";
// import { ObjectId } from "mongodb";

// export default class CoinRepository {
//   async getAll() {
//     // const siteUrl =
//     //   "https://api.geckoterminal.com/api/v2/networks/trending-pools";
//     // try {
//     //   const { data } = await axios({
//     //     method: "GET",
//     //     url: siteUrl,
//     //     headers: {
//     //       "Content-Type": "application/json",
//     //     },
//     //   });
//     //   console.log(data);
//     //   return data.json();
//     // } catch (e) {
//     //   console.log(e);
//     // }
//     try {
//       const coins = await CoinTableModel.find().populate("vote");
//       return coins;
//     } catch (e) {
//       console.log(e);
//       throw new Error("Failed to get coins");
//     }
//   }

//   async getAllPromoted() {
//     try {
//       const coins = await PromotedCoinTableModel.find().populate("vote");
//       return coins;
//     } catch (e) {
//       console.log(e);
//       throw new Error("Failed to get coins");
//     }
//   }

//   async add(newCoin) {
//     // const address = newCoin.address;
//     // const response = await axios.get(
//     //   `https://api.geckoterminal.com/api/v2/search/pools?query=${address}`
//     // );
//     // const responseData = response.data.data[0]?.attributes;
//     // const marketCapUsd = responseData?.market_cap_usd;
//     // const hours24 = responseData?.price_change_percentage?.h24;

//     // newCoin.marketCapUsd = marketCapUsd;
//     // newCoin.hours24 = hours24;

//     try {
//       const coin = new CoinModel(newCoin);
//       const vote = new VoteModel();
//       await vote.save();
//       coin.vote = vote._id;
//       const savedCoin = await coin.save();
//       return savedCoin;
//     } catch (error) {
//       console.log(error);
//       throw new Error("Failed to save coin to the database");
//     }
//   }

//   async reviewAndAdd(coinId) {
//     const coin = await CoinModel.findById(coinId);
//     if (!coin) {
//       return res.status(404).send("Coin not found");
//     }
//     coin.reviewed = true;
//     await coin.save();

//     // Move to cointable collection
//     const newCoin = new CoinTableModel(coin.toObject());
//     const addedCoin = await newCoin.save();
//     await CoinModel.findByIdAndDelete(coinId);
//     return addedCoin;
//   }
//   catch(error) {
//     console.log(error);
//     throw new Error("Failed to add coin to the cointable database");
//   }

//   async promote(coinId) {
//     try {
//       // Find the coin in the CoinTable collection
//       const coin = await CoinTableModel.findById(coinId).populate("vote");
//       if (!coin) {
//         throw new Error("Coin not found");
//       }

//       // Create a new entry in the PromotedCoinTable with the same vote reference
//       const promotedCoin = new PromotedCoinTableModel(coin.toObject());
//       promotedCoin._id = mongoose.Types.ObjectId(); // Create a new ObjectId for the promoted coin
//       promotedCoin.vote = coin.vote._id;
//       await promotedCoin.save();

//       return promotedCoin;
//     } catch (error) {
//       console.log(error);
//       throw new Error("Failed to promote coin");
//     }
//   }

//   async toggleVote(coinId) {
//     try {
//       console.log(coinId);
//       // Find the vote document associated with the coin
//       const coin = await CoinTableModel.findOne({ _id: new ObjectId(coinId) });
//       if (!vote) {
//         throw new Error("Coin not found");
//       }
//       console.log(coin);
//       // Increment the vote count
//       // coin.vote.count += 1;
//       // await vote.save();

//       // return vote;
//     } catch (error) {
//       console.log(error);
//       throw new Error("Failed to toggle vote");
//     }
//   }
// }

import { ObjectId } from "mongodb";
import axios from "axios";
import mongoose from "mongoose";
import CoinModel from "./coin.model.js";
import {
  CoinTableModel,
  PromotedCoinTableModel,
  VoteModel,
} from "./coinTable.model.js";

export default class CoinRepository {
  async getAll() {
    try {
      const coins = await CoinTableModel.find();
      return coins;
    } catch (e) {
      console.log(e);
      throw new Error("Failed to get coins");
    }
  }

  async getAllPromoted() {
    try {
      const coins = await PromotedCoinTableModel.find();
      return coins;
    } catch (e) {
      console.log(e);
      throw new Error("Failed to get coins");
    }
  }

  async getCoin(id) {
    try {
      const coin = await CoinTableModel.findById(id);
      return coin;
    } catch (error) {
      console.log(error);
      throw new Error("Failed to get coin from the database");
    }
  }

  async getCoinByAddress(address) {
    try {
      const coin = await CoinTableModel.findOne({ address });
      return coin;
    } catch (error) {
      console.log(error);
      throw new Error("Failed to get coin from the database");
    }
  }

  async getCoinByQuery(query) {
    try {
      console.log("Query: ", query);
      // const coin = await CoinTableModel.findOne({
      //   $or: [{ name: query }, { symbol: query }, { address: query }],
      // });
      const coin = await CoinTableModel.findOne({ name: query });
      console.log("Coin: ", coin);
      return coin;
    } catch (error) {
      console.log(error);
      throw new Error("Failed to get coin from the database");
    }
  }

  async add(newCoin) {
    try {
      const coin = new CoinModel(newCoin);
      // const vote = new VoteModel();
      // await vote.save();
      // coin.vote = vote.count;
      const savedCoin = await coin.save();
      return savedCoin;
    } catch (error) {
      console.log(error);
      throw new Error("Failed to save coin to the database");
    }
  }

  async reviewAndAdd(coinId) {
    try {
      const coin = await CoinModel.findById(coinId);
      if (!coin) {
        throw new Error("Coin not found");
      }
      coin.reviewed = true;
      await coin.save();

      // Move to CoinTable collection
      const newCoin = new CoinTableModel(coin.toObject());
      // newCoin.vote = new VoteModel();
      const addedCoin = await newCoin.save();
      await CoinModel.findByIdAndDelete(coinId);
      return addedCoin;
    } catch (error) {
      console.log(error);
      throw new Error("Failed to add coin to the cointable database");
    }
  }

  async promote(coinId) {
    try {
      const coin = await CoinTableModel.findById(coinId).populate("vote");
      if (!coin) {
        throw new Error("Coin not found");
      }

      const promotedCoin = new PromotedCoinTableModel(coin.toObject());
      // promotedCoin._id = new ObjectId(); // Create a new ObjectId for the promoted coin
      // promotedCoin.vote = coin.vote._id;
      await promotedCoin.save();

      return promotedCoin;
    } catch (error) {
      console.log(error);
      throw new Error("Failed to promote coin");
    }
  }

  async toggleVote(coinId) {
    try {
      const coin = await CoinTableModel.findOne({
        _id: ObjectId.createFromHexString(coinId),
      });
      console.log(coin);
      const promotedCoin = await PromotedCoinTableModel.findOne({
        _id: ObjectId.createFromHexString(coinId),
      });
      console.log(promotedCoin);
      if (coin) {
        coin.vote += 1;
        await coin.save();
      }
      if (promotedCoin) {
        promotedCoin.vote += 1;
        await promotedCoin.save();
      }
      return "Vote added successfully";
    } catch (error) {
      console.log(error);
      throw new Error("Failed to toggle vote");
    }
  }

  // async toggleVote(coinId, ipAddress) {
  //   try {
  //     const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);

  //     const coin = await CoinTableModel.findById(coinId);

  //     if (!coin) {
  //       throw new Error("Coin not found");
  //     }

  //     // Check if the user has already voted within the last hour
  //     const recentVote = coin.voteHistory.find(
  //       (vote) => vote.ipAddress === ipAddress && vote.timestamp > oneHourAgo
  //     );

  //     if (recentVote) {
  //       throw new Error("You can only vote once per hour");
  //     }

  //     // Add vote to the main coin table
  //     coin.vote += 1;
  //     coin.voteHistory.push({ ipAddress, timestamp: new Date() });
  //     await coin.save();

  //     // Check if the coin is also in the promoted coin table
  //     const promotedCoin = await PromotedCoinTableModel.findById(coinId);

  //     if (promotedCoin) {
  //       // Synchronize the vote count and history
  //       promotedCoin.vote = coin.vote;
  //       promotedCoin.voteHistory = coin.voteHistory;
  //       await promotedCoin.save();
  //     }

  //     return "Vote added successfully";
  //   } catch (error) {
  //     console.log(error);
  //     throw new Error("Failed to toggle vote");
  //   }
  // }
}
