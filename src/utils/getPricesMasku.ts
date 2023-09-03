import axios from "axios";
import * as cheerio from "cheerio"; // Import Cheerio
import { getPriceAsNumber } from "./price.utils";

export class GetPricesMasku {
  async execute(link) {
    const response = await axios.get(link);
    const $ = cheerio.load(response.data.trim());

    const salePriceAsText = $(".price").text();
    const priceAsText = $(".list_price").text();
    const parsedPrice = getPriceAsNumber(priceAsText);
    const saleParsedPrice = getPriceAsNumber(
      salePriceAsText)

    const salePrice = saleParsedPrice === parsedPrice ? 0 : saleParsedPrice

    return { salePrice, price: parsedPrice };
  }
}
