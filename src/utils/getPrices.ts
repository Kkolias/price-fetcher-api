import ShopItem from "../Schema/ShopItem";
import { GetPricesPower } from "./getPircesPower";
import { GetPricesJimms } from "./getPricesJimms";
import { GetPricesMasku } from "./getPricesMasku";
import { GetPricesVerkkokauppa } from "./getPricesVerkkokauppa";

const HTML_PRICE_PATH = {
  JIMMS: "JIMMS",
  VERKKO_KAUPPA: "VERKKO_KAUPPA",
  MASKU: "MASKU",
  POWER: "POWER",
  GIGANTTI: "GIGANTTI",
};

export class GetPrices {
  constructor() {}

  getDependency(key) {
    if (key === HTML_PRICE_PATH.JIMMS) {
      return new GetPricesJimms();
    }
    if (key === HTML_PRICE_PATH.VERKKO_KAUPPA) {
      return new GetPricesVerkkokauppa();
    }
    if (key === HTML_PRICE_PATH.MASKU) {
      return new GetPricesMasku();
    }
    if (key === HTML_PRICE_PATH.POWER) {
      return new GetPricesPower();
    }
  }

  async createNew({ name, key, link }) {
    const getPriceUtil = this.getDependency(key);

    const { salePrice, price } = await getPriceUtil.execute(link);

    const newItem = new ShopItem({
      name,
      link,
      key,
      priceList: [{ date: new Date(), salePrice, price }],
    });
    return newItem;
  }

  async updateShopItemPrice(shopItem) {
    const { key, link } = shopItem;
    const getPriceUtil = this.getDependency(key);

    const { salePrice, price } = await getPriceUtil.execute(link);

    shopItem.priceList.push({
      date: new Date(),
      price,
      salePrice,
    });

    // Save the shop item with the updated priceList
    await shopItem.save();
  }
}

export default new GetPrices();
