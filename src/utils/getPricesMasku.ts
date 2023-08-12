import axios from "axios";
import * as cheerio from "cheerio"; // Import Cheerio

export class GetPricesMasku {
  async execute(link) {
    const response = await axios.get(link);
    const $ = cheerio.load(response.data.trim());

    const priceAsText = $(".price").text();
    const salePriceAsText = $(".list_price").text();
    const parsedPrice = parseFloat(priceAsText?.replace(",", ".") as string);
    const saleParsedPrice = parseFloat(
      salePriceAsText?.replace(",", ".") as string
    );
    return { salePrice: saleParsedPrice, price: parsedPrice };
  }
}
