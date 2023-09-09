import express, { Request, Response } from "express";
import mongoose from "mongoose";
import ShopItem from "./Schema/ShopItem";
import util from './utils/getPrices'
import cron from "node-cron";
import { isProduction } from './utils/isProduction'
import cronJobUtil from "./utils/cron.util";
require('dotenv').config();

const app = express();
const port = 3000;

const cors = require("cors");

app.use(express.json());


const allowedOrigins = ["http://localhost:3000", "91.153.178.250"];
const corsOptions = {
  origin: function (origin: string, callback: any) {
    if (!origin) {
      callback(null, true);
    }
     else if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
};

app.use(cors());

// Connect to MongoDB

// local
// const mongoUrl = "mongodb://admin:password@localhost:27018/?authMechanism=DEFAULT"
// dev
// const mongoUrl = `mongodb+srv://develiask:I0yYAtpHxlyD2kqE@eliaskcluster.xizgwyh.mongodb.net/`
const mongoUrl = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@eliaskcluster.xizgwyh.mongodb.net/` // dev

mongoose.connect(mongoUrl, { dbName: 'price-fetcher-db' });
// mongoose.connect(mongoUrl, { dbName: 'shop-items-db' });


// 10 s = "*/10 * * * * *"
// midnight = "0 0 * * *"
const cronTime = isProduction() ? '0 0 * * *' : "*/60 * * * * *"


cron.schedule(cronTime, async () => {
    console.log("CRON RUNNING!!!!")
    cronJobUtil.updateAllPriceLists()
})



// API routes

app.get(
  "/shop-items/get-all",
  cors(corsOptions),
  async (_req: Request, res: Response) => {
    try {
      const shopItems = await ShopItem.find();
      console.log("JOUJOUoO")
      res.status(200).json(shopItems);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to retrieve items" });
    }
  }
);


app.post(
    "/shop-items/add",
    cors(corsOptions),
    async (req: Request, res: Response) => {
      try {
        const { name, link, key } = req.body;
        
        const newItem = await util.createNew({ name, key, link })
  
        await newItem.save();
  
        res.status(201).json(newItem);
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to add shop item" });
      }
    }
  );








app.listen(port, () => {
    console.log(`Server running on port ${port}`);
    console.log("IS PRODUCTION?: ", isProduction())
});
