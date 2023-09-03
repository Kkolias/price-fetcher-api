import mongoose, { Schema, Document } from "mongoose";

interface IPriceItem {
  date: Date;
  price: number;
  salePrice: number;
}

interface IShopItem extends Document {
  name: string;
  link: string;
  priceList: IPriceItem[];
  key: String
}

const ShopItemSchema = new Schema<IShopItem>({
  name: { type: String, required: true },
  link: { type: String, required: true },
  key: { type: String, required: true},
  priceList: [
    {
      date: { type: Date, required: true },
      price: { type: Number, required: true },
      salePrice: { type: Number, required: true },
    },
  ],
});

const ShopItem = mongoose.model<IShopItem>("ShopItem", ShopItemSchema);

export default ShopItem;
