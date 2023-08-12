import express, { Request, Response } from "express";
import mongoose from "mongoose";
import axios from "axios";
import * as cheerio from "cheerio"; // Import Cheerio
import ShopItem from "./Schema/ShopItem";
import { createShopItem } from "./utils/getPriceModel";
import util from './utils/getPrices'

const app = express();
const port = 8000;

const cors = require("cors");

app.use(express.json());


const allowedOrigins = ["http://localhost:3000", "100.112.240.70"];
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
mongoose.connect("mongodb://localhost:27017/shop-items-database");

// API routes


app.get(
  "/shop-items/get-all",
  cors(corsOptions),
  async (_req: Request, res: Response) => {
    try {
      const shopItems = await ShopItem.find();
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
        // const newItem = await createShopItem({ name, link, key })
        // Fetch the initial price using Axios and Cheerio
        // const response = await axios.get(link);
        // const $ = cheerio.load(response.data);
        // const priceAsText = $(".price__amount span").text(); // You need to adjust this based on the actual HTML structure of the price element
        // const parsePrice = parseFloat(priceAsText.replace(',', '.'))

        // console.log("ASDADA: ", priceAsText)
        // // Create a new shop item with the initial price
        // const newItem = new ShopItem({
        //   name,
        //   link,
        //   priceList: [{ date: new Date(), price: parsePrice }],
        // });
  
        // await newItem.save();
  
        res.status(201).json(newItem);
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to add shop item" });
      }
    }
  );








app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});

// app.get(
//   "/fishing-permit/get-by-id",
//   cors(corsOptions),
//   async (req: Request, res: Response) => {
//     try {
//       const id = req?.query?.id || null
//       const fishingPermit = await FishingPermit.findById(id)
//       res.status(200).json(fishingPermit);
//     } catch (error) {
//       console.error(error);
//       res.status(500).json({ error: "Failed to retrieve fishing permits" });
//     }
//   }
// );