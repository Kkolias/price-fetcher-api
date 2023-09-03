import axios from "axios";
import * as cheerio from "cheerio"; // Import Cheerio
import { getPriceAsNumber } from "./price.utils";

export class GetPricesVerkkokauppa {
  async execute(link) {
    const response = await axios.get(link);
    const $ = cheerio.load(response.data);

    const priceAsText = $(
      ".Price-sc-1eckydb-2 data[data-price='previous']"
    ).attr("value");
    const priceDecimalAsText = $(
      ".Price-sc-1eckydb-2 data[data-price='previous']"
    ).attr("data-decimals");

    const parsedPrice = getPriceAsNumber(priceAsText);
    const parsedDecimal = getPriceAsNumber(priceDecimalAsText);
    const totalParsed = (parsedPrice + parsedDecimal) || null;

    const salePriceAsText = $(
      ".Price-sc-1eckydb-2 data[data-price='current']"
    ).attr("value");
    const salePriceDecimalAsText = $(
      ".Price-sc-1eckydb-2 data[data-price='current']"
    ).attr("data-decimals");

    console.log("XXXXXX:", parsedPrice, parsedDecimal)
    const saleParsedPrice = getPriceAsNumber(salePriceAsText);
    const saleParsedDecimal = getPriceAsNumber(salePriceDecimalAsText);
    const saleTotalParsed = saleParsedPrice + saleParsedDecimal;

    const salePrice = totalParsed ? saleTotalParsed : 0
    const price = totalParsed ? totalParsed : saleTotalParsed

    return { salePrice, price };
  }
}
