import CoinRepository from "./coin.repository.js";
import { CoinTableModel } from "./coinTable.model.js";

export default class CoinController {
  constructor() {
    this.coinRepository = new CoinRepository();
  }

  async getAllCoins(req, res) {
    try {
      const coinList = await this.coinRepository.getAll();
      res.status(201).json(coinList);
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Failed to add coin" });
    }
  }

  async getAllPromotedCoins(req, res) {
    try {
      const promotedCoinList = await this.coinRepository.getAllPromoted();
      res.status(201).json(promotedCoinList);
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Failed to add coin" });
    }
  }

  async getCoinByID(req, res) {
    try {
      console.log("here1");
      const coinId = req.params.id;
      console.log("here2", coinId);
      const coin = await this.coinRepository.getCoin(coinId);
      console.log("here3", coin);
      res.status(200).json(coin);
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Failed to get coin using ID" });
    }
  }

  async getCoinByAddress(req, res) {
    try {
      const address = req.params.address;
      const coin = await this.coinRepository.getCoinByAddress(address);
      res.status(200).json(coin);
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Failed to get coin using Address" });
    }
  }

  async addCoin(req, res) {
    try {
      const newCoin = req.body;
      const logo = req.file ? req.file.firebaseUrl : "";
      newCoin.logo = logo;
      const savedCoin = await this.coinRepository.add(newCoin);
      res.status(201).json(savedCoin);
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Failed to add coin" });
    }
  }

  async reviewAndAddCoin(req, res) {
    try {
      const coinId = req.params.id;
      const addedCoin = await this.coinRepository.reviewAndAdd(coinId);
      res.status(201).json(addedCoin);
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Failed to review and add coin" });
    }
  }

  async promoteCoin(req, res) {
    try {
      const coinId = req.params.id;
      const promotedCoin = await this.coinRepository.promote(coinId);
      res.status(201).json(promotedCoin);
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Failed to promote coin" });
    }
  }

  async toggleVote(req, res) {
    try {
      const coinId = req.params.id;
      const ipAddress = req.ip; // Get user's IP address
      const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);

      const coin = await CoinTableModel.findById(coinId);

      if (!coin) {
        return res.status(404).json({ message: "Coin not found" });
      }

      // Check if the user has already voted within the last hour
      const recentVote = coin.voteHistory.find(
        (vote) => vote.ipAddress === ipAddress && vote.timestamp > oneHourAgo
      );

      if (recentVote) {
        return res
          .status(400)
          .json({ message: "You can only vote once per hour" });
      }

      // Add vote
      coin.vote += 1;
      coin.voteHistory.push({ ipAddress, timestamp: new Date() });
      await coin.save();

      res.status(201).json({ message: "Vote added successfully" });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Failed to toggle vote" });
    }
  }
}
