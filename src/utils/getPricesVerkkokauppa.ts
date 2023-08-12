import axios from "axios";
import * as cheerio from "cheerio"; // Import Cheerio

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

    const parsedPrice = parseFloat(priceAsText as string);
    const parsedDecimal = parseFloat(priceDecimalAsText as string);
    const totalParsed = parsedPrice + parsedDecimal;

    const salePriceAsText = $(
      ".Price-sc-1eckydb-2 data[data-price='current']"
    ).attr("value");
    const salePriceDecimalAsText = $(
      ".Price-sc-1eckydb-2 data[data-price='current']"
    ).attr("data-decimals");

    const saleParsedPrice = parseFloat(salePriceAsText as string);
    const saleParsedDecimal = parseFloat(salePriceDecimalAsText as string);
    const saleTotalParsed = saleParsedPrice + saleParsedDecimal;
    return { salePrice: saleTotalParsed, price: totalParsed };
  }
}
