import axios from "axios";
import * as cheerio from "cheerio"; // Import Cheerio

export class GetPricesJimms {
  async execute(link) {
    const response = await axios.get(link);
    const $ = cheerio.load(response.data);

    const priceAsText = $(
      ".jim-product-cta-box-inner h1 span[itemprop='name']"
    ).text();
    const salePriceAsText = $(".price__amount span[itemprop='price']").attr(
      "content"
    );

    const priceNormal = priceAsText.split("Norm.")[1];
    const parsedPrice = parseFloat(priceNormal?.replace(",", ".") as string);
    const parsedSalePrice = parseFloat(
      salePriceAsText?.replace(",", ".") as string
    );

    return { salePrice: parsedSalePrice, price: parsedPrice };
  }
}
