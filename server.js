import express from "express";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet";
import { connectUsingMongoose } from "./src/Config/mongooseConfig.js";
import upload from "./src/middlewares/fileupload.middleware.js";
import CoinController from "./src/features/coin/coin.controller.js";
import uploadMiddleware from "./src/middlewares/fileupload.middleware.js";
dotenv.config();

const server = express();
// server.use(cors());
const allowedOrigins = [
  "https://www.coinfinder.cc",
  "https://coin-finder.onrender.com",
];
server.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
  })
);
server.use(bodyParser.json());
server.use(
  helmet({
    xFrameOptions: { action: "sameorigin" },
  })
);
// server.use(express.static(__dirname));

const coinController = new CoinController();

server.post("/", uploadMiddleware, (req, res) => {
  coinController.addCoin(req, res);
});
// server.post("/", upload.single("logo"), (req, res) => {
//   coinController.addCoin(req, res);
// });
server.get("/coins", (req, res) => {
  coinController.getAllCoins(req, res);
});
server.get("/promoted", (req, res) => {
  coinController.getAllPromotedCoins(req, res);
});
server.get("/search/:address", (req, res) => {
  console.log("inside search address");
  coinController.getCoinByAddress(req, res);
});
server.get("/coin/:id", (req, res) => {
  console.log("inside get coin");
  coinController.getCoinByID(req, res);
});
server.post("/review/:id", (req, res) => {
  console.log(`Received POST request for review with ID: ${req.params.id}`);
  coinController.reviewAndAddCoin(req, res);
});
server.post("/promote/:id", (req, res) => {
  coinController.promoteCoin(req, res);
});
server.post("/coins/:id/vote", (req, res) =>
  coinController.toggleVote(req, res)
);

server.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

server.listen(3200, () => {
  console.log("Listening on port 3200");
  connectUsingMongoose();
});
